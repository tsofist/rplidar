import * as SerialPort from 'serialport';
import { RPLidarDriverBase } from './driver-base';
import { RPLidarPortFinder } from './types';
export declare class RPLidar extends RPLidarDriverBase {
    #private;
    get serialPortPath(): string | undefined;
    protected get port(): SerialPort;
    static isRPLidarPort(info: SerialPort.PortInfo): boolean | undefined;
    motorStart(): Promise<void>;
    motorStop(): Promise<void>;
    close(): Promise<void>;
    open(portPath?: string | RPLidarPortFinder): Promise<this>;
    protected doPortWrite(data: number[]): Promise<void>;
    protected resolvePortPath(portPath: string | RPLidarPortFinder): Promise<string>;
    protected doPortRead(len: number): Promise<Uint8Array>;
    protected doPortReadAll(): Promise<number>;
}
