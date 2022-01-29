import { Buffer } from 'buffer';
import { RPLidarHealth, RPLidarHealthStatus, RPLidarInfo, RPLidarScanSampleRates } from '../types';
import { CommandSecondByte, CommandStartByte, ResponseHeaderLength } from './index';

export const CMDStop = {
    build() {
        return Buffer.from([CommandStartByte, 0x25]);
    },
};

export const CMDReset = {
    build() {
        return Buffer.from([CommandStartByte, 0x40]);
    },
    detectResponse(raw: Buffer): boolean {
        if (raw.length !== 64) return false;

        return (
            raw[0] === 0x52 &&
            raw[1] === 0x50 &&
            raw[2] === 0x20 &&
            raw[3] === 0x4c &&
            raw[4] === 0x49 &&
            raw[5] === 0x44 &&
            raw[6] === 0x41 &&
            raw[7] === 0x52
        );
    },
    parseResponse(raw: Buffer): string {
        return raw.toString();
    },
};

export const CMDInfo = {
    build() {
        return Buffer.from([CommandStartByte, 0x50]);
    },
    detectResponse(raw: Buffer): boolean {
        return (
            raw.length === ResponseHeaderLength + 20 &&
            raw[0] === CommandStartByte &&
            raw[1] === CommandSecondByte &&
            raw[2] === 0x14 &&
            raw[3] === 0x00 &&
            raw[4] === 0x00 &&
            raw[5] === 0x00 &&
            raw[6] === 0x04
        );
    },
    parseResponse(raw: Buffer): RPLidarInfo {
        return {
            model: raw[7],
            firmware: [raw[8], raw[9]],
            hardware: raw[10],
            serial: raw
                .slice(11, 27)
                .reduce(
                    (acc, item) => `${acc}${item.toString(16).toUpperCase().padStart(2, '0')}`,
                    '',
                ),
        };
    },
};

export const CMDHealth = {
    build() {
        return Buffer.from([CommandStartByte, 0x52]);
    },
    detectResponse(raw: Buffer): boolean {
        if (raw.length !== ResponseHeaderLength + 3) return false;

        return (
            raw[0] === CommandStartByte &&
            raw[1] === CommandSecondByte &&
            raw[2] === 0x03 &&
            raw[3] === 0x00 &&
            raw[4] === 0x00 &&
            raw[5] === 0x00 &&
            raw[6] === 0x06
        );
    },
    parseResponse(raw: Buffer): RPLidarHealth {
        const status: RPLidarHealthStatus = raw.readUInt8(ResponseHeaderLength);
        return {
            status,
            statusText: RPLidarHealthStatus[status],
            error: raw.readUInt16LE(8),
        };
    },
};

export const CMDSampleRate = {
    build() {
        return Buffer.from([CommandStartByte, 0x59]);
    },
    detectResponse(raw: Buffer): boolean {
        if (raw.length !== ResponseHeaderLength + 4) return false;

        return (
            raw[0] === CommandStartByte &&
            raw[1] === CommandSecondByte &&
            raw[2] === 0x04 &&
            raw[3] === 0x00 &&
            raw[4] === 0x00 &&
            raw[5] === 0x00 &&
            raw[6] === 0x15
        );
    },
    parseResponse(raw: Buffer): RPLidarScanSampleRates {
        return {
            standard: raw.readUInt16LE(7),
            express: raw.readUInt16LE(9),
        };
    },
};
