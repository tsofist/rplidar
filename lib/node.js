"use strict";
var _RPLidar_port;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPLidar = void 0;
const tslib_1 = require("tslib");
const buffer_1 = require("buffer");
const SerialPort = require("serialport");
const consts_1 = require("./consts");
const driver_base_1 = require("./driver-base");
const util_1 = require("./util");
class RPLidar extends driver_base_1.RPLidarDriverBase {
    constructor() {
        super(...arguments);
        _RPLidar_port.set(this, void 0);
    }
    get serialPortPath() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_port, "f")?.path;
    }
    get port() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_port, "f") || (0, util_1.raise)('RPLidar serial port not opened');
    }
    static isRPLidarPort(info) {
        const vendorId = info.vendorId ? parseInt(info.vendorId, 16) : undefined;
        return vendorId === consts_1.USBVendorId;
    }
    motorStart() {
        this.port.set({ dtr: false });
        return (0, util_1.delay)(10);
    }
    motorStop() {
        this.port.set({ dtr: true });
        return (0, util_1.delay)(10);
    }
    async close() {
        return new Promise((resolve, reject) => {
            if (!(0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_port, "f")?.isOpen)
                return resolve();
            this.resetScanning();
            (0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_port, "f").close((error) => {
                if (error)
                    return reject(error);
                (0, tslib_1.__classPrivateFieldSet)(this, _RPLidar_port, undefined, "f");
                resolve();
                this.onPortClose();
            });
        });
    }
    async open(portPath = RPLidar.isRPLidarPort) {
        if ((0, tslib_1.__classPrivateFieldGet)(this, _RPLidar_port, "f"))
            return (0, util_1.raise)('Port already opened');
        const serialPortPath = await this.resolvePortPath(portPath);
        await new Promise((resolve, reject) => {
            const port = new SerialPort(serialPortPath, {
                autoOpen: true,
                baudRate: driver_base_1.RPLidarDriverBase.portBaudRate,
                highWaterMark: driver_base_1.RPLidarDriverBase.portHighWaterMark,
            }, (error) => error && reject(error));
            port.on('error', (error) => this.onPortError(error));
            port.on('close', async (data) => {
                if (data && data.disconnect) {
                    this.resetScanning();
                    (0, tslib_1.__classPrivateFieldSet)(this, _RPLidar_port, undefined, "f");
                    this.onPortDisconnect();
                }
            });
            port.on('open', () => {
                this.debugLog('PORT OPENED');
                (0, tslib_1.__classPrivateFieldSet)(this, _RPLidar_port, port, "f");
                port.flush(async (error) => {
                    if (error)
                        return reject(error);
                    await this.onPortPostOpen();
                    this.debugLog('READY');
                    resolve(port);
                });
            });
        });
        return this;
    }
    doPortWrite(data) {
        return new Promise((resolve, reject) => {
            this.port.write(buffer_1.Buffer.from(data), 'binary', (error) => {
                if (error)
                    return reject(error);
                else
                    resolve();
            });
        });
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
    async doPortRead(len) {
        const cmd = this.currentCommand;
        let result = null;
        do {
            if (this.currentCommand !== cmd)
                return new Uint8Array();
            result = await new Promise((resolve) => {
                this.port.once('readable', async () => {
                    const data = (await this.port.read(len));
                    resolve(data ? new Uint8Array(data) : null);
                });
            });
            if (result == null)
                await (0, util_1.delay)(5);
        } while (result == null);
        return result;
    }
    async doPortReadAll() {
        return new Promise((resolve) => {
            this.port.resume();
            this.port.once('data', (data) => {
                resolve(data.length);
            });
        });
    }
}
exports.RPLidar = RPLidar;
_RPLidar_port = new WeakMap();
void (async () => {
    setInterval(() => {
        //
    }, 5000);
    const lidar = new RPLidar();
    console.log('Opening lidar port..');
    await lidar.open();
    const start = async () => {
        // Lidar spinning by default
        await lidar.motorStop();
        await (0, util_1.delay)(1000);
        console.log(`RPLidar ready on "${lidar.serialPortPath}"`);
        console.log(`Device health:`, await lidar.getHealth());
        console.log(`Lidar Info:`, await lidar.getInfo());
        console.log(`Lidar samples rates:`, await lidar.getSamplesRate());
        console.log(`Lidar scanning modes:`, await lidar.listScanModes());
        lidar.on(`scan:sample`, (sample) => {
            // console.log(`Scan sample:`, sample);
            if (sample.start)
                console.log(`Actual speed: ${lidar.scanningRPM}RPM (${lidar.scanningHz}Hz). A:${sample.angle}`);
            // console.log(sample.start);
        });
        console.log(`Start scanning..`);
        await lidar.motorStart();
        await lidar.scanStart();
        await (0, util_1.delay)(3000);
        console.log(`Stop scanning..`);
        await lidar.scanStop();
        console.log('Scan stopped');
        await lidar.motorStop();
        await (0, util_1.delay)(1000);
    };
    await start();
    await (0, util_1.delay)(1000);
    await start();
    await (0, util_1.delay)(1000);
    await start();
    console.log('Closing..');
    await lidar.close();
    console.log(`Lidar port closed`);
    process.exit();
})();
//# sourceMappingURL=node.js.map