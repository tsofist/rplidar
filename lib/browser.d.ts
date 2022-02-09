/// <reference types="node" />
import { Readable } from 'stream';
import { RPLidarDriverBase } from './driver-base';
export declare class RPLidarBrowser extends RPLidarDriverBase {
    #private;
    get serialPortPath(): undefined;
    protected get port(): BrowserSerialPort;
    protected get portReadable(): Readable & {
        readonly locked: boolean;
        cancel(): Promise<void>;
        getReader(): BrowserSerialPortReader;
        tee(): any;
        pipeTo(target: any): any;
    };
    protected get portWriter(): BrowserSerialPortWriter;
    protected get portReader(): BrowserSerialPortReader;
    protected get native(): NavigatorSerial;
    motorStart(): Promise<void>;
    motorStop(): Promise<void>;
    open(): Promise<this>;
    close(): Promise<void>;
    protected resolvePort(): Promise<BrowserSerialPort>;
    protected doPortReadAll(): Promise<number>;
    protected doPortRead(len: number): Promise<Uint8Array>;
    protected doPortWrite(data: number[]): Promise<void>;
}
interface NavigatorSerial {
    getPorts(): Promise<BrowserSerialPort[]>;
    requestPort(options: {
        filters: {
            usbProductId?: number;
            usbVendorId?: number;
        }[];
    }): Promise<BrowserSerialPort | never>;
}
interface BrowserSerialPort {
    writable?: {
        readonly locked: boolean;
        abort(): Promise<void>;
        getWriter(): BrowserSerialPortWriter;
    };
    readable?: Readable & {
        readonly locked: boolean;
        cancel(): Promise<void>;
        getReader(): BrowserSerialPortReader;
        tee(): any;
        pipeTo(target: any): any;
    };
    getInfo(): {
        usbProductId: number;
        usbVendorId: number;
    };
    open(options: {
        baudRate: number;
        bufferSize: number;
    }): Promise<void>;
    close(): Promise<void>;
    setSignals(options: {
        dataTerminalReady: boolean;
    }): Promise<void>;
    addEventListener(event: string, handler: (data: any) => void): this;
}
interface BrowserSerialPortReader {
    read(a?: any): Promise<{
        done: boolean;
        value: null | Uint8Array;
    }>;
    releaseLock(): void;
    cancel(): Promise<void>;
}
interface BrowserSerialPortWriter {
    write(data: Uint8Array): Promise<void>;
    releaseLock(): void;
    cancel(): Promise<void>;
}
export {};
