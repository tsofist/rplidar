"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMDSampleRate = exports.CMDHealth = exports.CMDInfo = exports.CMDReset = exports.CMDStop = void 0;
const buffer_1 = require("buffer");
const types_1 = require("../types");
const index_1 = require("./index");
exports.CMDStop = {
    build() {
        return buffer_1.Buffer.from([index_1.CommandStartByte, 0x25]);
    },
};
exports.CMDReset = {
    build() {
        return buffer_1.Buffer.from([index_1.CommandStartByte, 0x40]);
    },
    detectResponse(raw) {
        if (raw.length !== 64)
            return false;
        return (raw[0] === 0x52 &&
            raw[1] === 0x50 &&
            raw[2] === 0x20 &&
            raw[3] === 0x4c &&
            raw[4] === 0x49 &&
            raw[5] === 0x44 &&
            raw[6] === 0x41 &&
            raw[7] === 0x52);
    },
    parseResponse(raw) {
        return raw.toString();
    },
};
exports.CMDInfo = {
    build() {
        return buffer_1.Buffer.from([index_1.CommandStartByte, 0x50]);
    },
    detectResponse(raw) {
        return (raw.length === index_1.ResponseHeaderLength + 20 &&
            raw[0] === index_1.CommandStartByte &&
            raw[1] === index_1.CommandSecondByte &&
            raw[2] === 0x14 &&
            raw[3] === 0x00 &&
            raw[4] === 0x00 &&
            raw[5] === 0x00 &&
            raw[6] === 0x04);
    },
    parseResponse(raw) {
        return {
            model: raw[7],
            firmware: [raw[8], raw[9]],
            hardware: raw[10],
            serial: raw
                .slice(11, 27)
                .reduce((acc, item) => `${acc}${item.toString(16).toUpperCase().padStart(2, '0')}`, ''),
        };
    },
};
exports.CMDHealth = {
    build() {
        return buffer_1.Buffer.from([index_1.CommandStartByte, 0x52]);
    },
    detectResponse(raw) {
        if (raw.length !== index_1.ResponseHeaderLength + 3)
            return false;
        return (raw[0] === index_1.CommandStartByte &&
            raw[1] === index_1.CommandSecondByte &&
            raw[2] === 0x03 &&
            raw[3] === 0x00 &&
            raw[4] === 0x00 &&
            raw[5] === 0x00 &&
            raw[6] === 0x06);
    },
    parseResponse(raw) {
        const status = raw.readUInt8(index_1.ResponseHeaderLength);
        return {
            status,
            statusText: types_1.RPLidarHealthStatus[status],
            error: raw.readUInt16LE(8),
        };
    },
};
exports.CMDSampleRate = {
    build() {
        return buffer_1.Buffer.from([index_1.CommandStartByte, 0x59]);
    },
    detectResponse(raw) {
        if (raw.length !== index_1.ResponseHeaderLength + 4)
            return false;
        return (raw[0] === index_1.CommandStartByte &&
            raw[1] === index_1.CommandSecondByte &&
            raw[2] === 0x04 &&
            raw[3] === 0x00 &&
            raw[4] === 0x00 &&
            raw[5] === 0x00 &&
            raw[6] === 0x15);
    },
    parseResponse(raw) {
        return {
            standard: raw.readUInt16LE(7),
            express: raw.readUInt16LE(9),
        };
    },
};
//# sourceMappingURL=common.js.map