"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMDScan = void 0;
const buffer_1 = require("buffer");
const index_1 = require("./index");
exports.CMDScan = {
    build(forceMode = false) {
        return buffer_1.Buffer.from([index_1.CommandStartByte, forceMode ? 0x21 : 0x20]);
    },
    detectResponse(raw) {
        if (raw.length !== index_1.ResponseHeaderLength)
            return false;
        return (raw[0] === index_1.CommandStartByte &&
            raw[1] === index_1.CommandSecondByte &&
            raw[2] === 0x05 &&
            raw[3] === 0x00 &&
            raw[4] === 0x00 &&
            raw[5] === 0x40 &&
            raw[6] === 0x81);
    },
    parseResponse(raw) {
        const s = raw.readUInt8(0) & 0x01;
        const sInverse = (raw.readUInt8(0) >> 1) & 0x01;
        if (s === sInverse)
            return;
        const start = s === 1;
        let quality = raw.readUInt8(0) >> 2;
        const checkBit = raw.readUInt8(1) & 0x01;
        if (checkBit !== 1)
            return;
        const angle = Math.floor(((raw.readUInt8(1) >> 1) + (raw.readUInt8(2) << 7)) / 64);
        if (angle > 360)
            quality = 0;
        const distance = Math.floor(raw.readUInt16LE(3) / 4);
        return {
            start,
            quality,
            angle,
            distance,
        };
    },
    bufferizeResponse(raw, buffer) {
        const data = buffer_1.Buffer.concat([buffer, raw]);
        const dataLength = data.length;
        const extraBits = dataLength % 5;
        let sample;
        for (let offset = 0; offset < dataLength - extraBits; offset += 5) {
            sample = exports.CMDScan.parseResponse(data.slice(offset, offset + 5));
            if (!sample)
                return {};
        }
        buffer = data.slice(dataLength - extraBits, dataLength);
        return { sample, buffer };
    },
};
//# sourceMappingURL=scan.js.map