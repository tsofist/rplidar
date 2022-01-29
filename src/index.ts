import { Buffer } from 'buffer';
import { EventEmitter } from 'events';
import * as SerialPort from 'serialport';
import { CMDHealth, CMDInfo, CMDReset, CMDSampleRate, CMDStop } from './protorol/common';
import { CMDConfig, ConfigCmd, ConfigCommand } from './protorol/config';
import { CMDScan } from './protorol/scan';
import {
    RPLidarHealth,
    RPLidarInfo,
    RPLidarPortFinder,
    RPLidarScanModeInfo,
    RPLidarScanSampleRates,
} from './types';
import { delay, raise, round, waitForEvent } from './util';

/**
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/sl_lidar_driver.h
 */
export class RPLidar extends EventEmitter {
    #port: SerialPort | undefined;
    #rpmStat: RPMStat | undefined;
    #scanning = false;
    #scanBuffer = Buffer.alloc(0);

    get serialPortPath() {
        return this.#port?.path;
    }

    get scanning() {
        return this.#scanning;
    }

    get scanningRPM() {
        return this.#rpmStat?.rotations
            ? Math.round(this.#rpmStat.sum / this.#rpmStat.rotations)
            : 0;
    }

    get scanningHz() {
        return round(this.scanningRPM / 60);
    }

    protected get port() {
        return this.#port || raise('RPLidar serial port not opened');
    }

    async open(portPath: string | RPLidarPortFinder = isRPLidarPort) {
        if (this.#port) raise('Port already opened');
        const serialPortPath = await this.resolvePortPath(portPath);

        await new Promise<SerialPort>((resolve, reject) => {
            const port = new SerialPort(
                serialPortPath,
                {
                    baudRate: 115200,
                    highWaterMark: 256,
                },
                (error) => error && reject(error),
            );
            port.on('error', (error) => this.emit('error', error));
            port.on('disconnect', () => this.emit('disconnect'));
            port.on('close', () => this.emit('close'));
            port.on('conf', (data) => this.emit('conf', data));
            port.on('data', (data) => this.processResponse(port, data));
            port.on('scan:sample', (data) => this.emit('scan:sample', data));
            port.on('scan:start-frame', () => {
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
            });
            port.on('open', () => {
                this.#port = port;
                port.flush(async (error) => {
                    if (error) return reject(error);
                    await this.reset();
                    await this.motorStart();
                    this.emit('ready');

                    resolve(port);
                });
            });
        });

        return this;
    }

    async close() {
        await new Promise<void>((resolve, reject) => {
            if (!this.#port?.isOpen) return resolve();

            this.#port.close((error) => {
                if (error) return reject(error);
                this.#port = undefined;
                resolve();
            });
        });
    }

    reset() {
        this.port.write(CMDReset.build());
        return waitForEvent<string>(this.port, 'boot');
    }

    getHealth() {
        this.port.write(CMDHealth.build());
        return waitForEvent<RPLidarHealth>(this.port, 'health');
    }

    getInfo() {
        this.port.write(CMDInfo.build());
        return waitForEvent<RPLidarInfo>(this.port, 'info');
    }

    getSamplesRate() {
        this.port.write(CMDSampleRate.build());
        return waitForEvent<RPLidarScanSampleRates>(this.port, 'sample-rates');
    }

    motorStart() {
        this.port.set({ dtr: false });
        return delay(5);
    }

    motorStop() {
        this.port.set({ dtr: true });
        return delay(5);
    }

    /**
     * Start scanning
     * @param forceMode Force the core system to output scan data regardless whether the scanning motor is rotating or not
     */
    async scanStart(forceMode = false) {
        if (this.#scanning) return;
        this.port.write(CMDScan.build(forceMode));
        return waitForEvent(this.port, 'scan:start');
    }

    /**
     * Ask the RPLIDAR core system to stop the current scan operation and enter idle state
     */
    async scanStop() {
        if (!this.#scanning) return;
        this.port.write(CMDStop.build());
        this.resetScanning();
    }

    async listScanModes(): Promise<RPLidarScanModeInfo[]> {
        const result = [];
        for (
            let mode = 0;
            mode < (await this.getScanConf<number>(ConfigCommand.SCAN_MODE_COUNT));
            mode++
        ) {
            result.push(await this.explainScanMode(mode));
        }
        return result;
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

    protected getScanConf<T>(def: ConfigCmd, scanModeId?: number) {
        this.port.write(CMDConfig.build(def, scanModeId));
        return waitForEvent<T>(this.port, 'conf');
    }

    protected async explainScanMode(scanModeId: number): Promise<RPLidarScanModeInfo> {
        return {
            id: scanModeId,
            name: await this.getScanConf(ConfigCommand.SCAN_MODE_NAME, scanModeId),
            maxDistance: await this.getScanConf(ConfigCommand.SCAN_MODE_MAX_DISTANCE, scanModeId),
            sampleTime: await this.getScanConf(ConfigCommand.SCAN_MODE_US_PER_SAMPLE, scanModeId),
            isTypical:
                scanModeId ===
                (await this.getScanConf(ConfigCommand.SCAN_MODE_TYPICAL, scanModeId)),
        };
    }

    protected processResponse(port: SerialPort, raw: Buffer) {
        if (CMDScan.detectResponse(raw)) {
            this.resetScanning();
            port.emit('scan:start');
            this.#scanBuffer = Buffer.alloc(0);
            this.#scanning = true;
        } else if (CMDConfig.detectResponse(raw)) {
            this.resetScanning();
            port.emit('conf', CMDConfig.parseResponse(raw));
        } else if (CMDSampleRate.detectResponse(raw)) {
            this.resetScanning();
            port.emit('sample-rates', CMDSampleRate.parseResponse(raw));
        } else if (CMDHealth.detectResponse(raw)) {
            this.resetScanning();
            port.emit('health', CMDHealth.parseResponse(raw));
        } else if (CMDInfo.detectResponse(raw)) {
            this.resetScanning();
            port.emit('info', CMDInfo.parseResponse(raw));
        } else if (CMDReset.detectResponse(raw)) {
            this.resetScanning();
            port.emit('boot', CMDReset.parseResponse(raw));
        } else if (this.#scanning) {
            try {
                const { sample, buffer } = CMDScan.bufferizeResponse(raw, this.#scanBuffer);
                if (sample) port.emit('scan:sample', sample);
                if (sample?.start) port.emit('scan:start-frame');
                this.#scanBuffer = buffer || Buffer.alloc(0);
            } catch (e) {
                port.emit('error', e);
            }
        }
    }

    protected resetScanning() {
        if (this.scanning) {
            this.#rpmStat = undefined;
            this.#scanning = false;
            this.emit('scan:stop');
        }
    }
}

function isRPLidarPort(info: SerialPort.PortInfo): boolean | undefined {
    return info.manufacturer?.includes('Silicon Labs');
}

interface RPMStat {
    startScanFrame: number;
    rotations: number;
    sum: number;
}
