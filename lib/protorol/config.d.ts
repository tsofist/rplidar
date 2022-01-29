import { Buffer } from 'buffer';
export interface ConfigCmd {
    code: number;
    payloadSize: number;
}
/**
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/rplidar_cmd.h
 */
export declare const ConfigCommand: {
    SCAN_MODE_COUNT: {
        code: number;
        payloadSize: number;
    };
    SCAN_MODE_US_PER_SAMPLE: {
        code: number;
        payloadSize: number;
    };
    SCAN_MODE_MAX_DISTANCE: {
        code: number;
        payloadSize: number;
    };
    SCAN_MODE_TYPICAL: {
        code: number;
        payloadSize: number;
    };
    SCAN_MODE_NAME: {
        code: number;
        payloadSize: number;
    };
};
export declare const CMDConfig: {
    build(def: ConfigCmd, scanModeId?: number | undefined): Buffer;
    detectResponse(raw: Buffer): boolean;
    parseResponse(raw: Buffer): string | number | undefined;
};
