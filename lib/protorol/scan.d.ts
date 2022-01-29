import { Buffer } from 'buffer';
import { RPLidarScanSample } from '../types';
export declare const CMDScan: {
    build(forceMode?: boolean): Buffer;
    detectResponse(raw: Buffer): boolean;
    parseResponse(raw: Buffer): RPLidarScanSample | undefined;
    bufferizeResponse(raw: Buffer, buffer: Buffer): {
        sample?: undefined;
        buffer?: undefined;
    } | {
        sample: RPLidarScanSample | undefined;
        buffer: Buffer;
    };
};
