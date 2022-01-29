import { Buffer } from 'buffer';
import { CommandSecondByte, CommandStartByte, ResponseHeaderLength } from './index';

export interface ConfigCmd {
    code: number;
    payloadSize: number;
}

/**
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/rplidar_cmd.h
 */
export const ConfigCommand = {
    SCAN_MODE_COUNT: { code: 0x70, payloadSize: 0 },
    SCAN_MODE_US_PER_SAMPLE: { code: 0x71, payloadSize: 4 },
    SCAN_MODE_MAX_DISTANCE: { code: 0x74, payloadSize: 2 },
    SCAN_MODE_TYPICAL: { code: 0x7c, payloadSize: 1 },
    SCAN_MODE_NAME: { code: 0x7f, payloadSize: 2 },
};

export const CMDConfig = {
    build(def: ConfigCmd, scanModeId?: number) {
        const cmd = Buffer.alloc(3 + 4 + def.payloadSize + 1);
        cmd[0] = 0xa5;
        cmd[1] = 0x84;
        cmd[2] = 4 + def.payloadSize; // S, size = type + payloadSize
        cmd.writeUInt32LE(def.code, 3);

        if (scanModeId != null) cmd.writeUInt16LE(scanModeId, 7);

        const checkSum = cmd.reduce((total = 0, num, idx, buf) =>
            idx < buf.length - 1 ? total ^ num : total,
        );
        cmd.writeUInt8(checkSum, cmd.length - 1);

        return cmd;
    },
    detectResponse(raw: Buffer) {
        return (
            raw[0] === CommandStartByte &&
            raw[1] === CommandSecondByte &&
            // skip (S) size byte
            raw[3] === 0x00 &&
            raw[4] === 0x00 &&
            raw[5] === 0x00 &&
            raw[6] === 0x20
        );
    },
    parseResponse(raw: Buffer): string | number | undefined {
        const buffer = raw.subarray(ResponseHeaderLength);
        const configRequestType = buffer.readUInt32LE(0);

        switch (configRequestType) {
            case ConfigCommand.SCAN_MODE_COUNT.code:
                return buffer.readUInt16LE(4);
            case ConfigCommand.SCAN_MODE_US_PER_SAMPLE.code:
                return buffer.readUInt32LE(4);
            case ConfigCommand.SCAN_MODE_MAX_DISTANCE.code:
                return buffer.readUInt32LE(4);
            case ConfigCommand.SCAN_MODE_TYPICAL.code:
                return buffer.readUInt16LE(4);
            case ConfigCommand.SCAN_MODE_NAME.code:
                return buffer.toString('utf8', 4, buffer.length - 1);
            default:
                return undefined;
        }
    },
};
