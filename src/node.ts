import { Buffer } from 'buffer';
import * as SerialPort from 'serialport';
import { USBVendorId } from './consts';
import { RPLidarDriverBase } from './driver-base';
import { RPLidarPortFinder } from './types';
import { delay, raise } from './util';

export class RPLidar extends RPLidarDriverBase {
    #port: SerialPort | undefined;

    get serialPortPath() {
        return this.#port?.path;
    }

    protected get port() {
        return this.#port || raise('RPLidar serial port not opened');
    }

    static isRPLidarPort(info: SerialPort.PortInfo): boolean | undefined {
        const vendorId = info.vendorId ? parseInt(info.vendorId, 16) : undefined;
        return vendorId === USBVendorId;
    }

    motorStart(): Promise<void> {
        this.port.set({ dtr: false });
        return delay(10);
    }

    motorStop(): Promise<void> {
        this.port.set({ dtr: true });
        return delay(10);
    }

    async close() {
        return new Promise<void>((resolve, reject) => {
            if (!this.#port?.isOpen) return resolve();

            this.resetScanning();
            this.#port.close((error) => {
                if (error) return reject(error);
                this.#port = undefined;
                resolve();
                this.onPortClose();
            });
        });
    }

    async open(portPath: string | RPLidarPortFinder = RPLidar.isRPLidarPort) {
        if (this.#port) return raise('Port already opened');
        const serialPortPath = await this.resolvePortPath(portPath);

        await new Promise<SerialPort>((resolve, reject) => {
            const port = new SerialPort(
                serialPortPath,
                {
                    autoOpen: true,
                    baudRate: RPLidarDriverBase.portBaudRate,
                    highWaterMark: RPLidarDriverBase.portHighWaterMark,
                },
                (error) => error && reject(error),
            );

            port.on('error', (error) => this.onPortError(error));
            port.on('close', async (data) => {
                if (data && data.disconnect) {
                    this.resetScanning();
                    this.#port = undefined;
                    this.onPortDisconnect();
                }
            });

            port.on('open', () => {
                this.debugLog('PORT OPENED');
                this.#port = port;
                port.flush(async (error) => {
                    if (error) return reject(error);
                    await this.onPortPostOpen();
                    this.debugLog('READY');
                    resolve(port);
                });
            });
        });

        return this;
    }

    protected doPortWrite(data: number[]) {
        return new Promise<void>((resolve, reject) => {
            this.port.write(Buffer.from(data), 'binary', (error) => {
                if (error) return reject(error);
                else resolve();
            });
        });
    }

    protected async resolvePortPath(portPath: string | RPLidarPortFinder) {
        if (!portPath) raise(`RPLidar port not specified`);
        if (typeof portPath === 'function') {
            const port = (await SerialPort.list()).find(portPath);
            if (!port) raise(`RPLidar not connected`);
            portPath = port.path;
        }
        return portPath;
    }

    protected async doPortRead(len: number): Promise<Uint8Array> {
        const cmd = this.currentCommand;
        let result: Uint8Array | null = null;
        do {
            if (this.currentCommand !== cmd) return new Uint8Array();
            result = await new Promise<Uint8Array | null>((resolve) => {
                this.port.once('readable', async () => {
                    const data = (await this.port.read(len)) as Buffer | null;
                    resolve(data ? new Uint8Array(data) : null);
                });
            });
            if (result == null) await delay(5);
        } while (result == null);
        return result;
    }

    protected async doPortReadAll() {
        return new Promise<number>((resolve) => {
            this.port.resume();
            this.port.once('data', (data: { length: number }) => {
                resolve(data.length);
            });
        });
    }
}
