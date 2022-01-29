import type { PortInfo } from 'serialport';

export enum RPLidarHealthStatus {
    Good = 0x00,
    Warning = 0x01,
    Error = 0x02,
}

export interface RPLidarInfo {
    /** Device model */
    model: number;
    /** Serial number */
    serial: string;
    /** Firmware version */
    firmware: [minor: number, major: number];
    /** Hardware version */
    hardware: number;
}

export interface RPLidarHealth {
    status: RPLidarHealthStatus;
    statusText: string;
    error: number;
}

export interface RPLidarScanSample {
    /** Scanning start-point */
    start: boolean;
    /** Measurement quality (0 ~ 255) */
    quality: number;
    /** Fixed point angle description in z presentation */
    angle: number;
    /** Distance in millimeter of fixed point values */
    distance: number;
}

export interface RPLidarScanSampleRates {
    standard: number;
    express: number;
}

export interface RPLidarScanModeInfo {
    id: number;
    name: string;
    maxDistance: number;
    sampleTime: number; //microseconds
    isTypical: boolean;
}

export type RPLidarPortFinder = (port: PortInfo) => boolean | undefined;
