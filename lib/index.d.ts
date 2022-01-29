/// <reference types="node" />
import { Buffer } from 'buffer';
import { EventEmitter } from 'events';
import * as SerialPort from 'serialport';
import { ConfigCmd } from './protorol/config';
import { RPLidarHealth, RPLidarInfo, RPLidarPortFinder, RPLidarScanModeInfo, RPLidarScanSampleRates } from './types';
/**
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/sl_lidar_driver.h
 */
export declare class RPLidar extends EventEmitter {
    #private;
    get serialPortPath(): string | undefined;
    get scanning(): boolean;
    get scanningRPM(): number;
    get scanningHz(): number;
    protected get port(): SerialPort;
    open(portPath?: string | RPLidarPortFinder): Promise<this>;
    close(): Promise<void>;
    reset(): Promise<string>;
    getHealth(): Promise<RPLidarHealth>;
    getInfo(): Promise<RPLidarInfo>;
    getSamplesRate(): Promise<RPLidarScanSampleRates>;
    motorStart(): Promise<void>;
    motorStop(): Promise<void>;
    /**
     * Start scanning
     * @param forceMode Force the core system to output scan data regardless whether the scanning motor is rotating or not
     */
    scanStart(forceMode?: boolean): Promise<unknown>;
    /**
     * Ask the RPLIDAR core system to stop the current scan operation and enter idle state
     */
    scanStop(): Promise<void>;
    listScanModes(): Promise<RPLidarScanModeInfo[]>;
    protected resolvePortPath(portPath: string | RPLidarPortFinder): Promise<string>;
    protected getScanConf<T>(def: ConfigCmd, scanModeId?: number): Promise<T>;
    protected explainScanMode(scanModeId: number): Promise<RPLidarScanModeInfo>;
    protected processResponse(port: SerialPort, raw: Buffer): void;
    protected resetScanning(): void;
}
