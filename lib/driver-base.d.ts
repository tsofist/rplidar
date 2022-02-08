/// <reference types="node" />
import { EventEmitter } from 'events';
import { RPLidarHealth, RPLidarInfo, RPLidarScanModeInfo, RPLidarScanSample, RPLidarScanSampleRates } from './types';
declare enum Command {
    Stop = 0,
    Reset = 1,
    Info = 2,
    Health = 3,
    SampleRate = 4,
    Config = 5,
    Scan = 6
}
interface CommandDescriptor {
    readonly single: boolean;
    readonly size: number;
    readonly type: number;
}
interface ConfigCommandDef {
    readonly code: number;
    readonly payloadSize: number;
}
/**
 * @private
 *
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/rplidar_driver.h SDK (driver)
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/rplidar_cmd.h SDK (cmd)
 * @see https://github.com/SkoltechRobotics/rplidar/blob/master/rplidar.py Python example
 */
export declare abstract class RPLidarDriverBase extends EventEmitter {
    #private;
    static readonly portBaudRate = 115200;
    static readonly portHighWaterMark = 256;
    debug: boolean;
    abstract readonly serialPortPath: string | undefined;
    get scanningRPM(): number;
    get scanningHz(): number;
    get scanning(): boolean;
    get idle(): boolean;
    protected get currentCommand(): Command | undefined;
    emit(event: 'disconnect'): boolean;
    emit(event: 'close'): boolean;
    emit(event: 'open'): boolean;
    emit(event: 'scan:stop'): boolean;
    emit(event: 'scan:start'): boolean;
    emit(event: 'scan:start-frame', data: RPLidarScanSample): boolean;
    emit(event: 'scan:sample', data: RPLidarScanSample): boolean;
    emit(event: 'error', data: Error): boolean;
    on(event: 'disconnect', listener: () => void): this;
    on(event: 'close', listener: () => void): this;
    on(event: 'open', listener: () => void): this;
    on(event: 'scan:stop', listener: () => void): this;
    on(event: 'scan:start', listener: () => void): this;
    on(event: 'scan:start-frame', listener: (data: RPLidarScanSample) => void): this;
    on(event: 'scan:sample', listener: (data: RPLidarScanSample) => void): this;
    on(event: 'error', listener: (data: Error) => void): this;
    abstract open(): Promise<this>;
    abstract close(): Promise<void>;
    abstract motorStart(): Promise<void>;
    abstract motorStop(): Promise<void>;
    reset(): Promise<void>;
    getHealth(): Promise<RPLidarHealth>;
    getInfo(): Promise<RPLidarInfo>;
    getSamplesRate(): Promise<RPLidarScanSampleRates>;
    scanStart(forceMode?: boolean): Promise<void>;
    scanStop(): Promise<void>;
    listScanModes(): Promise<RPLidarScanModeInfo[]>;
    protected collectScanResponse(raw: Uint8Array, buffer: Uint8Array): {
        sample?: undefined;
        buffer?: undefined;
    } | {
        sample: RPLidarScanSample | undefined;
        buffer: Uint8Array;
    };
    protected parseScanResponse(raw: Uint8Array): RPLidarScanSample | undefined;
    protected doReset(): Promise<void>;
    protected abstract doPortWrite(data: Uint8Array | number[]): Promise<void>;
    protected abstract doPortReadAll(): Promise<number>;
    protected abstract doPortRead(len: number): Promise<Uint8Array>;
    protected abstract portDrain(): Promise<void>;
    protected portReadAll(): Promise<number>;
    protected portRead(len: number): Promise<Uint8Array>;
    protected portWrite(data: Uint8Array | number[]): Promise<void>;
    protected writeCommand(cmd: Command, payload: number[] | Uint8Array): Promise<void>;
    protected writeCommand<R>(cmd: Command, payload: number[] | Uint8Array, onSent?: () => Promise<R>): Promise<R>;
    protected writeCommand<R>(cmd: Command, payload: number[] | Uint8Array, onSent?: (descriptor: CommandDescriptor) => Promise<R>, descriptorChecker?: (descriptor: CommandDescriptor) => void): Promise<R>;
    protected explainScanMode(scanMode: number): Promise<RPLidarScanModeInfo>;
    protected getScanConfig<T = unknown>(config: ConfigCommandDef, scanMode?: number): Promise<T>;
    protected readDescriptor(): Promise<CommandDescriptor>;
    protected onScanSample(sample: RPLidarScanSample): void;
    protected onPortClose(): void;
    protected onPortDisconnect(): void;
    protected onPortError(error: Error): void;
    protected onPortPostOpen(): Promise<void>;
    protected resetScanning(): void;
    protected debugLog(...data: any): void;
}
export {};
