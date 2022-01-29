import { Buffer } from 'buffer';
import { RPLidarHealth, RPLidarInfo, RPLidarScanSampleRates } from '../types';
export declare const CMDStop: {
    build(): Buffer;
};
export declare const CMDReset: {
    build(): Buffer;
    detectResponse(raw: Buffer): boolean;
    parseResponse(raw: Buffer): string;
};
export declare const CMDInfo: {
    build(): Buffer;
    detectResponse(raw: Buffer): boolean;
    parseResponse(raw: Buffer): RPLidarInfo;
};
export declare const CMDHealth: {
    build(): Buffer;
    detectResponse(raw: Buffer): boolean;
    parseResponse(raw: Buffer): RPLidarHealth;
};
export declare const CMDSampleRate: {
    build(): Buffer;
    detectResponse(raw: Buffer): boolean;
    parseResponse(raw: Buffer): RPLidarScanSampleRates;
};
