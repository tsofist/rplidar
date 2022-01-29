"use strict";
var _RPLidar_port, _RPLidar_rpmStat, _RPLidar_scanning, _RPLidar_scanBuffer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPLidar = void 0;
const tslib_1 = require("tslib");
const buffer_1 = require("buffer");
const events_1 = require("events");
const SerialPort = require("serialport");
const common_1 = require("./protorol/common");
const config_1 = require("./protorol/config");
const scan_1 = require("./protorol/scan");
const util_1 = require("./util");
/**
 * @see https://github.com/Slamtec/rplidar_sdk/blob/master/sdk/include/sl_lidar_driver.h
 */
class RPLidar extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        _RPLidar_port.set(this, void 0);
        _RPLidar_rpmStat.set(this, void 0);
        _RPLidar_scanning.set(this, false);
        _RPLidar_scanBuffer.set(this, buffer_1.Buffer.alloc(0));
    }
    get serialPortPath() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_port, "f")?.path;
    }
    get scanning() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_scanning, "f");
    }
    get scanningRPM() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_rpmStat, "f")?.rotations
            ? Math.round((0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_rpmStat, "f").sum / (0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_rpmStat, "f").rotations)
            : 0;
    }
    get scanningHz() {
        return (0, util_1.round)(this.scanningRPM / 60);
    }
    get port() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_port, "f") || (0, util_1.raise)('RPLidar serial port not opened');
    }
    async open(portPath = isRPLidarPort) {
        if ((0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_port, "f"))
            (0, util_1.raise)('Port already opened');
        const serialPortPath = await this.resolvePortPath(portPath);
        await new Promise((resolve, reject) => {
            const port = new SerialPort(serialPortPath, {
                baudRate: 115200,
                highWaterMark: 256,
            }, (error) => error && reject(error));
            port.on('error', (error) => this.emit('error', error));
            port.on('disconnect', () => this.emit('disconnect'));
            port.on('close', () => this.emit('close'));
            port.on('conf', (data) => this.emit('conf', data));
            port.on('data', (data) => this.processResponse(port, data));
            port.on('scan:sample', (data) => this.emit('scan:sample', data));
            port.on('scan:start-frame', () => {
                const now = Date.now();
                const stat = (0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_rpmStat, "f") ||
                    ((0, tslib_1.__classPrivateFieldSet)(this, _RPLidar_rpmStat, {
                        sum: 0,
                        rotations: 0,
                        startScanFrame: 0,
                    }, "f"));
                const elapsed = now - stat.startScanFrame;
                stat.startScanFrame = now;
                if (elapsed < 1000) {
                    stat.rotations++;
                    stat.sum += Math.round((1.0 / elapsed) * 60000);
                }
            });
            port.on('open', () => {
                (0, tslib_1.__classPrivateFieldSet)(this, _RPLidar_port, port, "f");
                port.flush(async (error) => {
                    if (error)
                        return reject(error);
                    await this.reset();
                    await this.motorStart();
                    this.emit('ready');
                    resolve(port);
                });
            });
        });
        return this;
    }
    async close() {
        await new Promise((resolve, reject) => {
            if (!(0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_port, "f")?.isOpen)
                return resolve();
            (0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_port, "f").close((error) => {
                if (error)
                    return reject(error);
                (0, tslib_1.__classPrivateFieldSet)(this, _RPLidar_port, undefined, "f");
                resolve();
            });
        });
    }
    reset() {
        this.port.write(common_1.CMDReset.build());
        return (0, util_1.waitForEvent)(this.port, 'boot');
    }
    getHealth() {
        this.port.write(common_1.CMDHealth.build());
        return (0, util_1.waitForEvent)(this.port, 'health');
    }
    getInfo() {
        this.port.write(common_1.CMDInfo.build());
        return (0, util_1.waitForEvent)(this.port, 'info');
    }
    getSamplesRate() {
        this.port.write(common_1.CMDSampleRate.build());
        return (0, util_1.waitForEvent)(this.port, 'sample-rates');
    }
    motorStart() {
        this.port.set({ dtr: false });
        return (0, util_1.delay)(5);
    }
    motorStop() {
        this.port.set({ dtr: true });
        return (0, util_1.delay)(5);
    }
    /**
     * Start scanning
     * @param forceMode Force the core system to output scan data regardless whether the scanning motor is rotating or not
     */
    async scanStart(forceMode = false) {
        if ((0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_scanning, "f"))
            return;
        this.port.write(scan_1.CMDScan.build(forceMode));
        return (0, util_1.waitForEvent)(this.port, 'scan:start');
    }
    /**
     * Ask the RPLIDAR core system to stop the current scan operation and enter idle state
     */
    async scanStop() {
        if (!(0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_scanning, "f"))
            return;
        this.port.write(common_1.CMDStop.build());
        this.resetScanning();
    }
    async listScanModes() {
        const result = [];
        for (let mode = 0; mode < (await this.getScanConf(config_1.ConfigCommand.SCAN_MODE_COUNT)); mode++) {
            result.push(await this.explainScanMode(mode));
        }
        return result;
    }
    async resolvePortPath(portPath) {
        if (!portPath)
            (0, util_1.raise)(`RPLidar port not specified`);
        if (typeof portPath === 'function') {
            const port = (await SerialPort.list()).find(portPath);
            if (!port)
                (0, util_1.raise)(`RPLidar not connected`);
            portPath = port.path;
        }
        return portPath;
    }
    getScanConf(def, scanModeId) {
        this.port.write(config_1.CMDConfig.build(def, scanModeId));
        return (0, util_1.waitForEvent)(this.port, 'conf');
    }
    async explainScanMode(scanModeId) {
        return {
            id: scanModeId,
            name: await this.getScanConf(config_1.ConfigCommand.SCAN_MODE_NAME, scanModeId),
            maxDistance: await this.getScanConf(config_1.ConfigCommand.SCAN_MODE_MAX_DISTANCE, scanModeId),
            sampleTime: await this.getScanConf(config_1.ConfigCommand.SCAN_MODE_US_PER_SAMPLE, scanModeId),
            isTypical: scanModeId ===
                (await this.getScanConf(config_1.ConfigCommand.SCAN_MODE_TYPICAL, scanModeId)),
        };
    }
    processResponse(port, raw) {
        if (scan_1.CMDScan.detectResponse(raw)) {
            this.resetScanning();
            port.emit('scan:start');
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidar_scanBuffer, buffer_1.Buffer.alloc(0), "f");
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidar_scanning, true, "f");
        }
        else if (config_1.CMDConfig.detectResponse(raw)) {
            this.resetScanning();
            port.emit('conf', config_1.CMDConfig.parseResponse(raw));
        }
        else if (common_1.CMDSampleRate.detectResponse(raw)) {
            this.resetScanning();
            port.emit('sample-rates', common_1.CMDSampleRate.parseResponse(raw));
        }
        else if (common_1.CMDHealth.detectResponse(raw)) {
            this.resetScanning();
            port.emit('health', common_1.CMDHealth.parseResponse(raw));
        }
        else if (common_1.CMDInfo.detectResponse(raw)) {
            this.resetScanning();
            port.emit('info', common_1.CMDInfo.parseResponse(raw));
        }
        else if (common_1.CMDReset.detectResponse(raw)) {
            this.resetScanning();
            port.emit('boot', common_1.CMDReset.parseResponse(raw));
        }
        else if ((0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_scanning, "f")) {
            try {
                const { sample, buffer } = scan_1.CMDScan.bufferizeResponse(raw, (0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_scanBuffer, "f"));
                if (sample)
                    port.emit('scan:sample', sample);
                if (sample?.start)
                    port.emit('scan:start-frame');
                (0, tslib_1.__classPrivateFieldSet)(this, _RPLidar_scanBuffer, buffer || buffer_1.Buffer.alloc(0), "f");
            }
            catch (e) {
                port.emit('error', e);
            }
        }
    }
    resetScanning() {
        if (this.scanning) {
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidar_rpmStat, undefined, "f");
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidar_scanning, false, "f");
            this.emit('scan:stop');
        }
    }
}
exports.RPLidar = RPLidar;
_RPLidar_port = new WeakMap(), _RPLidar_rpmStat = new WeakMap(), _RPLidar_scanning = new WeakMap(), _RPLidar_scanBuffer = new WeakMap();
function isRPLidarPort(info) {
    return info.manufacturer?.includes('Silicon Labs');
}
//# sourceMappingURL=index.js.map