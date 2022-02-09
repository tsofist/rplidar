"use strict";
var _RPLidarDriverBase_reading, _RPLidarDriverBase_writing, _RPLidarDriverBase_streaming, _RPLidarDriverBase_rpmStat, _RPLidarDriverBase_currentCommand, _RPLidarDriverBase_scanning;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPLidarDriverBase = void 0;
const tslib_1 = require("tslib");
const events_1 = require("events");
const consts_1 = require("./consts");
const types_1 = require("./types");
const util_1 = require("./util");
var Command;
(function (Command) {
    Command[Command["Stop"] = 0] = "Stop";
    Command[Command["Reset"] = 1] = "Reset";
    Command[Command["Info"] = 2] = "Info";
    Command[Command["Health"] = 3] = "Health";
    Command[Command["SampleRate"] = 4] = "SampleRate";
    Command[Command["Config"] = 5] = "Config";
    Command[Command["Scan"] = 6] = "Scan";
})(Command || (Command = {}));
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
class RPLidarDriverBase extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.debug = false;
        _RPLidarDriverBase_reading.set(this, void 0);
        _RPLidarDriverBase_writing.set(this, void 0);
        _RPLidarDriverBase_streaming.set(this, void 0);
        _RPLidarDriverBase_rpmStat.set(this, void 0);
        _RPLidarDriverBase_currentCommand.set(this, void 0);
        _RPLidarDriverBase_scanning.set(this, false);
    }
    get scanningRPM() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_rpmStat, "f")?.rotations
            ? Math.round((0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_rpmStat, "f").sum / (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_rpmStat, "f").rotations)
            : 0;
    }
    get scanningHz() {
        return (0, util_1.round)(this.scanningRPM / 60);
    }
    get scanning() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_scanning, "f");
    }
    get idle() {
        return !(0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_reading, "f") && !(0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_writing, "f") && !this.scanning && this.currentCommand == null;
    }
    get currentCommand() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_currentCommand, "f");
    }
    emit(event, ...data) {
        return super.emit(event, ...data);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    async reset() {
        this.resetScanning();
        await this.doReset();
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const resetAfterBytes = await this.portReadAll();
            if (resetAfterBytes === 64)
                return;
            else
                await this.doReset();
        }
    }
    async getHealth() {
        return this.writeCommand(Command.Health, [consts_1.CommandStartByte, 0x52], async (descriptor) => {
            const raw = await this.portRead(descriptor.size);
            const view = new DataView(raw.buffer);
            const status = view.getUint8(0);
            return {
                status,
                statusText: types_1.RPLidarHealthStatus[status],
                error: view.getUint16(1, true),
            };
        }, commandDescriptorChecker(3, 6, true));
    }
    async getInfo() {
        return this.writeCommand(Command.Info, [consts_1.CommandStartByte, 0x50], async (descriptor) => {
            const raw = await this.portRead(descriptor.size);
            return {
                model: raw[7],
                firmware: [raw[8], raw[9]],
                hardware: raw[10],
                serial: raw
                    .slice(11, 27)
                    .reduce((acc, item) => `${acc}${item.toString(16).toUpperCase().padStart(2, '0')}`, ''),
            };
        }, commandDescriptorChecker(20, 4, true));
    }
    async getSamplesRate() {
        return this.writeCommand(Command.SampleRate, [consts_1.CommandStartByte, 0x59], async (descriptor) => {
            const raw = await this.portRead(descriptor.size);
            const view = new DataView(raw.buffer);
            return {
                standard: view.getUint16(0, true),
                express: view.getUint16(2, true),
            };
        }, commandDescriptorChecker(4, 21, true));
    }
    async scanStart(forceMode = false) {
        if (this.scanning)
            return;
        await this.writeCommand(Command.Scan, [consts_1.CommandStartByte, forceMode ? 0x21 : 0x20], async (descriptor) => {
            this.emit('scan:start');
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_scanning, true, "f");
            let finishStreaming;
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_streaming, new Promise((resolve) => {
                finishStreaming = resolve;
            }), "f");
            const done = () => {
                (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_streaming, undefined, "f");
                finishStreaming && finishStreaming();
            };
            {
                const raw = await this.portRead(descriptor.size);
                if (raw.length !== 5) {
                    console.error(raw);
                    (0, util_1.raise)(`Incorrect start scan data`);
                }
            }
            void (async () => {
                let cache = new Uint8Array();
                // eslint-disable-next-line no-constant-condition
                while (true) {
                    if (this.scanning ||
                        !this.currentCommand ||
                        this.currentCommand === Command.Scan) {
                        const data = await this.portRead(descriptor.size);
                        if (!this.scanning) {
                            await this.reset();
                            return done();
                        }
                        const { sample, buffer } = this.collectScanResponse(data, cache);
                        if (!sample && !buffer) {
                            return done();
                        }
                        if (sample)
                            this.onScanSample(sample);
                        cache = buffer || new Uint8Array();
                    }
                    else {
                        return done();
                    }
                }
            })();
        }, commandDescriptorChecker(5, 129, false));
    }
    async scanStop() {
        await this.writeCommand(Command.Stop, [consts_1.CommandStartByte, 0x25], async () => {
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_scanning, false, "f");
            await (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_streaming, "f");
            this.resetScanning();
        });
    }
    async listScanModes() {
        const result = [];
        const modesCount = await this.getScanConfig(ScanModeConfigCommand.COUNT);
        for (let mode = 0; mode < modesCount; mode++) {
            result.push(await this.explainScanMode(mode));
        }
        return result;
    }
    collectScanResponse(raw, buffer) {
        const data = new Uint8Array([...buffer, ...raw]);
        const dataLength = data.length;
        const extraBits = dataLength % 5;
        let sample;
        for (let offset = 0; offset < dataLength - extraBits; offset += 5) {
            sample = this.parseScanResponse(data.slice(offset, offset + 5));
            if (!sample)
                return {};
        }
        buffer = data.slice(dataLength - extraBits, dataLength);
        return { sample, buffer };
    }
    parseScanResponse(raw) {
        const view = new DataView(raw.buffer);
        const s = view.getUint8(0) & 0x01;
        const sInverse = (view.getUint8(0) >> 1) & 0x01;
        if (s === sInverse)
            return;
        const start = s === 1;
        let quality = view.getUint8(0) >> 2;
        const checkBit = view.getUint8(1) & 0x01;
        if (checkBit !== 1)
            return;
        const angle = Math.floor(((view.getUint8(1) >> 1) + (view.getUint8(2) << 7)) / 64);
        if (angle > 360)
            quality = 0;
        const distance = Math.floor(view.getUint16(3, true) / 4);
        return {
            start,
            quality,
            angle,
            distance,
        };
    }
    async doReset() {
        await this.writeCommand(Command.Reset, [consts_1.CommandStartByte, 0x40]);
    }
    async portReadAll() {
        this.debugLog('READ ALL BYTES');
        try {
            await (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_writing, "f");
            return ((0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_reading, this.doPortReadAll(), "f"));
        }
        finally {
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_reading, undefined, "f");
        }
    }
    async portRead(len) {
        try {
            await (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_writing, "f");
            return ((0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_reading, this.doPortRead(len), "f"));
        }
        finally {
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_reading, undefined, "f");
        }
    }
    async portWrite(data) {
        try {
            await (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_reading, "f");
            return ((0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_writing, this.doPortWrite(data), "f"));
        }
        finally {
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_writing, undefined, "f");
        }
    }
    async writeCommand(cmd, payload, onSent, descriptorChecker) {
        this.debugLog(`[>] WRITE COMMAND ${Command[cmd]}`);
        (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_currentCommand, cmd, "f");
        try {
            await this.portWrite(payload);
            let descriptor;
            if (descriptorChecker) {
                descriptor = await this.readDescriptor();
                this.debugLog(`[!] DESCRIPTOR FOR ${Command[cmd]}`, descriptor);
                descriptorChecker(descriptor);
            }
            const result = onSent
                ? // @ts-expect-error Its OK
                    await onSent(descriptor)
                : undefined;
            this.debugLog(`[OK] COMMAND ${Command[cmd]} DOME`);
            return result;
        }
        finally {
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_currentCommand, undefined, "f");
        }
    }
    async explainScanMode(scanMode) {
        return {
            id: scanMode,
            name: await this.getScanConfig(ScanModeConfigCommand.NAME, scanMode),
            maxDistance: await this.getScanConfig(ScanModeConfigCommand.MAX_DISTANCE, scanMode),
            sampleTime: (await this.getScanConfig(ScanModeConfigCommand.US_PER_SAMPLE, scanMode)) /
                1000,
            isTypical: scanMode === (await this.getScanConfig(ScanModeConfigCommand.TYPICAL, scanMode)),
        };
    }
    async getScanConfig(config, scanMode) {
        const cmd = (() => {
            const cmd = new ArrayBuffer(3 + 4 + config.payloadSize + 1);
            const view = new DataView(cmd);
            view.setUint8(0, consts_1.CommandStartByte);
            view.setUint8(1, 0x84);
            view.setUint8(2, 4 + config.payloadSize);
            view.setUint32(3, config.code, true);
            if (scanMode != null)
                view.setUint16(consts_1.ResponseHeaderLength, scanMode, true);
            const checkSum = (() => {
                const part = new Uint8Array(cmd);
                return part.reduce((total = 0, num, idx, buf) => (idx < buf.length - 1 ? total ^ num : total), 0);
            })();
            view.setUint8(cmd.byteLength - 1, checkSum);
            return new Uint8Array(cmd);
        })();
        return this.writeCommand(Command.Config, cmd, async (descriptor) => {
            const raw = await this.portRead(descriptor.size);
            const view = new DataView(raw.buffer);
            const configType = view.getUint32(0, true);
            let result;
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
                    result = new TextDecoder().decode(raw.buffer.slice(4, raw.buffer.byteLength - 1));
                    break;
            }
            return result;
        }, commandDescriptorChecker(undefined, 32, true));
    }
    async readDescriptor() {
        const raw = await this.portRead(consts_1.ResponseHeaderLength);
        const view = new DataView(raw.buffer);
        if (raw.length !== consts_1.ResponseHeaderLength)
            (0, util_1.raise)('Descriptor length mismatch');
        if (view.getUint8(0) !== consts_1.CommandStartByte || view.getUint8(1) !== consts_1.CommandSecondByte) {
            console.error(`Broken command (${this.currentCommand != null ? Command[this.currentCommand] : 'NONE'}) descriptor`, raw);
            (0, util_1.raise)('Incorrect descriptor starting bytes');
        }
        return {
            single: view.getUint8(raw.length - 2) === 0,
            size: view.getUint8(2),
            type: view.getUint8(raw.length - 1),
        };
    }
    onScanSample(sample) {
        if (sample.start) {
            const now = Date.now();
            const stat = (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_rpmStat, "f") ||
                ((0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_rpmStat, {
                    sum: 0,
                    rotations: 0,
                    startScanFrame: 0,
                }, "f"));
            const elapsed = now - stat.startScanFrame;
            stat.startScanFrame = now;
            if (elapsed < 1000) {
                stat.rotations++;
                stat.sum += Math.round((1.0 / elapsed) * 60000);
            }
            this.emit('scan:start-frame', sample);
        }
        this.emit('scan:sample', sample);
    }
    onPortClose() {
        this.emit('close');
    }
    onPortDisconnect() {
        this.emit('disconnect');
    }
    onPortError(error) {
        this.emit('error', error);
    }
    async onPortPostOpen() {
        await this.reset();
        await this.motorStart();
        this.emit('open');
    }
    resetScanning() {
        if (this.scanning || (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarDriverBase_streaming, "f")) {
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_streaming, undefined, "f");
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_scanning, false, "f");
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarDriverBase_rpmStat, undefined, "f");
            this.emit('scan:stop');
        }
    }
    debugLog(...data) {
        if (this.debug)
            console.log(...data);
    }
}
exports.RPLidarDriverBase = RPLidarDriverBase;
_RPLidarDriverBase_reading = new WeakMap(), _RPLidarDriverBase_writing = new WeakMap(), _RPLidarDriverBase_streaming = new WeakMap(), _RPLidarDriverBase_rpmStat = new WeakMap(), _RPLidarDriverBase_currentCommand = new WeakMap(), _RPLidarDriverBase_scanning = new WeakMap();
RPLidarDriverBase.portBaudRate = 115200;
RPLidarDriverBase.portHighWaterMark = 256;
function commandDescriptorChecker(size, type, single) {
    return (descriptor) => {
        if (size != null && descriptor.size !== size)
            (0, util_1.raise)(`Invalid response len. Expected: ${size}, actual: ${descriptor.size}`);
        if (type != null && descriptor.type !== type)
            (0, util_1.raise)(`Invalid response data type. Expected: ${type}, actual: ${descriptor.type}`);
        if (single != null && descriptor.single !== single)
            (0, util_1.raise)(`Invalid response mode. Expected: ${single}, actual: ${descriptor.single}`);
    };
}
//# sourceMappingURL=driver-base.js.map