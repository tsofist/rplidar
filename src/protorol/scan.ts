import { Buffer } from 'buffer';
import { RPLidarScanSample } from '../types';
import { CommandSecondByte, CommandStartByte, ResponseHeaderLength } from './index';

export const CMDScan = {
    build(forceMode = false) {
        return Buffer.from([CommandStartByte, forceMode ? 0x21 : 0x20]);
    },
    detectResponse(raw: Buffer): boolean {
        if (raw.length !== ResponseHeaderLength) return false;

        return (
            raw[0] === CommandStartByte &&
            raw[1] === CommandSecondByte &&
            raw[2] === 0x05 &&
            raw[3] === 0x00 &&
            raw[4] === 0x00 &&
            raw[5] === 0x40 &&
            raw[6] === 0x81
        );
    },
    parseResponse(raw: Buffer): RPLidarScanSample | undefined {
        const s = raw.readUInt8(0) & 0x01;
        const sInverse = (raw.readUInt8(0) >> 1) & 0x01;
        if (s === sInverse) return;

        const start: boolean = s === 1;
        let quality = raw.readUInt8(0) >> 2;

        const checkBit = raw.readUInt8(1) & 0x01;
        if (checkBit !== 1) return;

        const angle = Math.floor(((raw.readUInt8(1) >> 1) + (raw.readUInt8(2) << 7)) / 64);
        if (angle > 360) quality = 0;

        const distance = Math.floor(raw.readUInt16LE(3) / 4);

        return {
            start,
            quality,
            angle,
            distance,
        };
    },
    bufferizeResponse(raw: Buffer, buffer: Buffer) {
        const data = Buffer.concat([buffer, raw]);
        const dataLength = data.length;
        const extraBits = dataLength % 5;

        let sample: RPLidarScanSample | undefined;

        for (let offset = 0; offset < dataLength - extraBits; offset += 5) {
            sample = CMDScan.parseResponse(data.slice(offset, offset + 5));
            if (!sample) return {};
        }
        buffer = data.slice(dataLength - extraBits, dataLength);

        return { sample, buffer };
    },
};
