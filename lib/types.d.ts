import type { PortInfo } from 'serialport';
export declare enum RPLidarHealthStatus {
    Good = 0,
    Warning = 1,
    Error = 2
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
    /** Maximum distance for this scan mode (in meters) */
    maxDistance: number;
    /** Time cost for one measurement (in milliseconds) */
    sampleTime: number;
    /** This mode is typical for scanning */
    isTypical: boolean;
}
export declare type RPLidarPortFinder = (port: PortInfo) => boolean | undefined;
