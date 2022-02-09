import { EventEmitter } from 'events';
import { CommandSecondByte, CommandStartByte, ResponseHeaderLength } from './consts';
import {
    RPLidarHealth,
    RPLidarHealthStatus,
    RPLidarInfo,
    RPLidarScanModeInfo,
    RPLidarScanSample,
    RPLidarScanSampleRates,
} from './types';
import { raise, round } from './util';

enum Command {
    Stop,
    Reset,
    Info,
    Health,
    SampleRate,
    Config,
    Scan,
}

interface CommandDescriptor {
    readonly single: boolean;
    readonly size: number;
    readonly type: number;
}

interface RPMStat {
    startScanFrame: number;
    rotations: number;
    sum: number;
}

interface ConfigCommandDef {
    readonly code: number;
    readonly payloadSize: number;
}

/**
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/rplidar_cmd.h
 */
const ScanModeConfigCommand = {
    COUNT: { code: 0x70, payloadSize: 0 },
    US_PER_SAMPLE: { code: 0x71, payloadSize: 4 },
    MAX_DISTANCE: { code: 0x74, payloadSize: 2 },
    TYPICAL: { code: 0x7c, payloadSize: 1 },
    NAME: { code: 0x7f, payloadSize: 2 },
};

/**
 * @private
 *
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/rplidar_driver.h SDK (driver)
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/rplidar_cmd.h SDK (cmd)
 * @see https://github.com/SkoltechRobotics/rplidar/blob/master/rplidar.py Python example
 */
export abstract class RPLidarDriverBase extends EventEmitter {
    static readonly portBaudRate = 115200;
    static readonly portHighWaterMark = 256;

    debug = false;

    abstract readonly serialPortPath: string | undefined;

    #reading: Promise<any> | undefined;
    #writing: Promise<any> | undefined;
    #streaming: Promise<any> | undefined;

    #rpmStat: RPMStat | undefined;
    #currentCommand: Command | undefined;
    #scanning = false;

    get scanningRPM() {
        return this.#rpmStat?.rotations
            ? Math.round(this.#rpmStat.sum / this.#rpmStat.rotations)
            : 0;
    }

    get scanningHz() {
        return round(this.scanningRPM / 60);
    }

    get scanning() {
        return this.#scanning;
    }

    get idle() {
        return !this.#reading && !this.#writing && !this.scanning && this.currentCommand == null;
    }

    protected get currentCommand() {
        return this.#currentCommand;
    }

    override emit(event: 'disconnect'): boolean;
    override emit(event: 'close'): boolean;
    override emit(event: 'open'): boolean;
    override emit(event: 'scan:stop'): boolean;
    override emit(event: 'scan:start'): boolean;
    override emit(event: 'scan:start-frame', data: RPLidarScanSample): boolean;
    override emit(event: 'scan:sample', data: RPLidarScanSample): boolean;
    override emit(event: 'error', data: Error): boolean;
    override emit(event: string, ...data: unknown[]): boolean {
        return super.emit(event, ...data);
    }

    override on(event: 'disconnect', listener: () => void): this;
    override on(event: 'close', listener: () => void): this;
    override on(event: 'open', listener: () => void): this;
    override on(event: 'scan:stop', listener: () => void): this;
    override on(event: 'scan:start', listener: () => void): this;
    override on(event: 'scan:start-frame', listener: (data: RPLidarScanSample) => void): this;
    override on(event: 'scan:sample', listener: (data: RPLidarScanSample) => void): this;
    override on(event: 'error', listener: (data: Error) => void): this;
    override on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    abstract open(): Promise<this>;
    abstract close(): Promise<void>;
    abstract motorStart(): Promise<void>;
    abstract motorStop(): Promise<void>;

    async reset() {
        this.resetScanning();
        await this.doReset();
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const resetAfterBytes = await this.portReadAll();
            if (resetAfterBytes === 64) return;
            else await this.doReset();
        }
    }

    async getHealth(): Promise<RPLidarHealth> {
        return this.writeCommand(
            Command.Health,
            [CommandStartByte, 0x52],
            async (descriptor) => {
                const raw = await this.portRead(descriptor.size);
                const view = new DataView(raw.buffer);
                const status = view.getUint8(0);
                return {
                    status,
                    statusText: RPLidarHealthStatus[status],
                    error: view.getUint16(1, true),
                };
            },
            commandDescriptorChecker(3, 6, true),
        );
    }

    async getInfo(): Promise<RPLidarInfo> {
        return this.writeCommand(
            Command.Info,
            [CommandStartByte, 0x50],
            async (descriptor) => {
                const raw = await this.portRead(descriptor.size);
                return {
                    model: raw[7],
                    firmware: [raw[8], raw[9]],
                    hardware: raw[10],
                    serial: raw
                        .slice(11, 27)
                        .reduce(
                            (acc, item) =>
                                `${acc}${item.toString(16).toUpperCase().padStart(2, '0')}`,
                            '',
                        ),
                };
            },
            commandDescriptorChecker(20, 4, true),
        );
    }

    async getSamplesRate(): Promise<RPLidarScanSampleRates> {
        return this.writeCommand(
            Command.SampleRate,
            [CommandStartByte, 0x59],
            async (descriptor) => {
                const raw = await this.portRead(descriptor.size);
                const view = new DataView(raw.buffer);
                return {
                    standard: view.getUint16(0, true),
                    express: view.getUint16(2, true),
                };
            },
            commandDescriptorChecker(4, 21, true),
        );
    }

    async scanStart(forceMode = false) {
        if (this.scanning) return;
        await this.writeCommand(
            Command.Scan,
            [CommandStartByte, forceMode ? 0x21 : 0x20],
            async (descriptor) => {
                this.emit('scan:start');
                this.#scanning = true;

                let finishStreaming: undefined | (() => void);
                this.#streaming = new Promise<void>((resolve) => {
                    finishStreaming = resolve;
                });

                const done = () => {
                    this.#streaming = undefined;
                    finishStreaming && finishStreaming();
                };

                {
                    const raw = await this.portRead(descriptor.size);
                    if (raw.length !== 5) {
                        console.error(raw);
                        raise(`Incorrect start scan data`);
                    }
                }

                void (async () => {
                    let cache = new Uint8Array();
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        if (
                            this.scanning ||
                            !this.currentCommand ||
                            this.currentCommand === Command.Scan
                        ) {
                            const data = await this.portRead(descriptor.size);

                            if (!this.scanning) {
                                await this.reset();
                                return done();
                            }

                            const { sample, buffer } = this.collectScanResponse(data, cache);
                            if (!sample && !buffer) {
                                return done();
                            }
                            if (sample) this.onScanSample(sample);

                            cache = buffer || new Uint8Array();
                        } else {
                            return done();
                        }
                    }
                })();
            },
            commandDescriptorChecker(5, 129, false),
        );
    }

    async scanStop() {
        await this.writeCommand(Command.Stop, [CommandStartByte, 0x25], async () => {
            this.#scanning = false;
            await this.#streaming;
            this.resetScanning();
        });
    }

    async listScanModes(): Promise<RPLidarScanModeInfo[]> {
        const result = [];
        const modesCount = await this.getScanConfig<number>(ScanModeConfigCommand.COUNT);
        for (let mode = 0; mode < modesCount; mode++) {
            result.push(await this.explainScanMode(mode));
        }
        return result;
    }

    protected collectScanResponse(raw: Uint8Array, buffer: Uint8Array) {
        const data = new Uint8Array([...buffer, ...raw]);
        const dataLength = data.length;
        const extraBits = dataLength % 5;

        let sample: RPLidarScanSample | undefined;

        for (let offset = 0; offset < dataLength - extraBits; offset += 5) {
            sample = this.parseScanResponse(data.slice(offset, offset + 5));
            if (!sample) return {};
        }
        buffer = data.slice(dataLength - extraBits, dataLength);

        return { sample, buffer };
    }

    protected parseScanResponse(raw: Uint8Array): RPLidarScanSample | undefined {
        const view = new DataView(raw.buffer);
        const s = view.getUint8(0) & 0x01;
        const sInverse = (view.getUint8(0) >> 1) & 0x01;
        if (s === sInverse) return;

        const start: boolean = s === 1;
        let quality = view.getUint8(0) >> 2;

        const checkBit = view.getUint8(1) & 0x01;
        if (checkBit !== 1) return;

        const angle = Math.floor(((view.getUint8(1) >> 1) + (view.getUint8(2) << 7)) / 64);
        if (angle > 360) quality = 0;

        const distance = Math.floor(view.getUint16(3, true) / 4);

        return {
            start,
            quality,
            angle,
            distance,
        };
    }

    protected async doReset() {
        await this.writeCommand(Command.Reset, [CommandStartByte, 0x40]);
    }

    protected abstract doPortWrite(data: Uint8Array | number[]): Promise<void>;
    protected abstract doPortReadAll(): Promise<number>;
    protected abstract doPortRead(len: number): Promise<Uint8Array>;

    protected async portReadAll() {
        this.debugLog('READ ALL BYTES');
        try {
            await this.#writing;
            return (this.#reading = this.doPortReadAll());
        } finally {
            this.#reading = undefined;
        }
    }

    protected async portRead(len: number) {
        try {
            await this.#writing;
            return (this.#reading = this.doPortRead(len));
        } finally {
            this.#reading = undefined;
        }
    }

    protected async portWrite(data: Uint8Array | number[]) {
        try {
            await this.#reading;
            return (this.#writing = this.doPortWrite(data));
        } finally {
            this.#writing = undefined;
        }
    }

    protected async writeCommand(cmd: Command, payload: number[] | Uint8Array): Promise<void>;
    protected async writeCommand<R>(
        cmd: Command,
        payload: number[] | Uint8Array,
        onSent?: () => Promise<R>,
    ): Promise<R>;
    protected async writeCommand<R>(
        cmd: Command,
        payload: number[] | Uint8Array,
        onSent?: (descriptor: CommandDescriptor) => Promise<R>,
        descriptorChecker?: (descriptor: CommandDescriptor) => void,
    ): Promise<R>;
    protected async writeCommand<R>(
        cmd: Command,
        payload: number[] | Uint8Array,
        onSent?: (descriptor: CommandDescriptor) => Promise<R>,
        descriptorChecker?: (descriptor: CommandDescriptor) => void,
    ): Promise<R> {
        this.debugLog(`[>] WRITE COMMAND ${Command[cmd]}`);
        this.#currentCommand = cmd;
        try {
            await this.portWrite(payload);
            let descriptor: CommandDescriptor | undefined;
            if (descriptorChecker) {
                descriptor = await this.readDescriptor();
                this.debugLog(`[!] DESCRIPTOR FOR ${Command[cmd]}`, descriptor);
                descriptorChecker(descriptor);
            }
            const result = onSent
                ? // @ts-expect-error Its OK
                  await onSent(descriptor)
                : (undefined as unknown as R);
            this.debugLog(`[OK] COMMAND ${Command[cmd]} DOME`);
            return result;
        } finally {
            this.#currentCommand = undefined;
        }
    }

    protected async explainScanMode(scanMode: number): Promise<RPLidarScanModeInfo> {
        return {
            id: scanMode,
            name: await this.getScanConfig(ScanModeConfigCommand.NAME, scanMode),
            maxDistance: await this.getScanConfig(ScanModeConfigCommand.MAX_DISTANCE, scanMode),
            sampleTime:
                (await this.getScanConfig<number>(ScanModeConfigCommand.US_PER_SAMPLE, scanMode)) /
                1_000,
            isTypical:
                scanMode === (await this.getScanConfig(ScanModeConfigCommand.TYPICAL, scanMode)),
        };
    }

    protected async getScanConfig<T = unknown>(
        config: ConfigCommandDef,
        scanMode?: number,
    ): Promise<T> {
        const cmd = (() => {
            const cmd = new ArrayBuffer(3 + 4 + config.payloadSize + 1);
            const view = new DataView(cmd);
            view.setUint8(0, CommandStartByte);
            view.setUint8(1, 0x84);
            view.setUint8(2, 4 + config.payloadSize);
            view.setUint32(3, config.code, true);
            if (scanMode != null) view.setUint16(ResponseHeaderLength, scanMode, true);

            const checkSum = (() => {
                const part = new Uint8Array(cmd);
                return part.reduce(
                    (total = 0, num, idx, buf) => (idx < buf.length - 1 ? total ^ num : total),
                    0,
                );
            })();

            view.setUint8(cmd.byteLength - 1, checkSum);

            return new Uint8Array(cmd);
        })();

        return this.writeCommand(
            Command.Config,
            cmd,
            async (descriptor) => {
                const raw = await this.portRead(descriptor.size);
                const view = new DataView(raw.buffer);
                const configType = view.getUint32(0, true);

                let result: string | number | undefined;

                switch (configType) {
                    case ScanModeConfigCommand.COUNT.code:
                        result = view.getUint16(4, true);
                        break;
                    case ScanModeConfigCommand.US_PER_SAMPLE.code:
                        result = view.getUint32(4, true);
                        break;
                    case ScanModeConfigCommand.MAX_DISTANCE.code:
                        result = view.getUint32(4, true);
                        break;
                    case ScanModeConfigCommand.TYPICAL.code:
                        result = view.getUint16(4, true);
                        break;
                    case ScanModeConfigCommand.NAME.code:
                        result = new TextDecoder().decode(
                            raw.buffer.slice(4, raw.buffer.byteLength - 1),
                        );
                        break;
                }
                return result as unknown as any;
            },
            commandDescriptorChecker(undefined, 32, true),
        );
    }

    protected async readDescriptor(): Promise<CommandDescriptor> {
        const raw = await this.portRead(ResponseHeaderLength);
        const view = new DataView(raw.buffer);

        if (raw.length !== ResponseHeaderLength) raise('Descriptor length mismatch');
        if (view.getUint8(0) !== CommandStartByte || view.getUint8(1) !== CommandSecondByte) {
            console.error(
                `Broken command (${
                    this.currentCommand != null ? Command[this.currentCommand] : 'NONE'
                }) descriptor`,
                raw,
            );
            raise('Incorrect descriptor starting bytes');
        }

        return {
            single: view.getUint8(raw.length - 2) === 0,
            size: view.getUint8(2),
            type: view.getUint8(raw.length - 1),
        };
    }

    protected onScanSample(sample: RPLidarScanSample) {
        if (sample.start) {
            const now = Date.now();
            const stat: RPMStat =
                this.#rpmStat ||
                (this.#rpmStat = {
                    sum: 0,
                    rotations: 0,
                    startScanFrame: 0,
                });
            const elapsed = now - stat.startScanFrame;
            stat.startScanFrame = now;

            if (elapsed < 1_000) {
                stat.rotations++;
                stat.sum += Math.round((1.0 / elapsed) * 60_000);
            }
            this.emit('scan:start-frame', sample);
        }
        this.emit('scan:sample', sample);
    }

    protected onPortClose() {
        this.emit('close');
    }

    protected onPortDisconnect() {
        this.emit('disconnect');
    }

    protected onPortError(error: Error) {
        this.emit('error', error);
    }

    protected async onPortPostOpen() {
        await this.reset();
        await this.motorStart();
        this.emit('open');
    }

    protected resetScanning() {
        if (this.scanning || this.#streaming) {
            this.#streaming = undefined;
            this.#scanning = false;
            this.#rpmStat = undefined;
            this.emit('scan:stop');
        }
    }

    protected debugLog(...data: any) {
        if (this.debug) console.log(...data);
    }
}

function commandDescriptorChecker(size?: number, type?: number, single?: boolean) {
    return (descriptor: CommandDescriptor) => {
        if (size != null && descriptor.size !== size)
            raise(`Invalid response len. Expected: ${size}, actual: ${descriptor.size}`);
        if (type != null && descriptor.type !== type)
            raise(`Invalid response data type. Expected: ${type}, actual: ${descriptor.type}`);
        if (single != null && descriptor.single !== single)
            raise(`Invalid response mode. Expected: ${single}, actual: ${descriptor.single}`);
    };
}
