"use strict";
var _RPLidarBrowser_port, _RPLidarBrowser_portReader, _RPLidarBrowser_portWriter, _RPLidarBrowser_portReaderBuffer, _PortBuffer_buffer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPLidarBrowser = void 0;
const tslib_1 = require("tslib");
const consts_1 = require("./consts");
const driver_base_1 = require("./driver-base");
const util_1 = require("./util");
class RPLidarBrowser extends driver_base_1.RPLidarDriverBase {
    constructor() {
        super(...arguments);
        _RPLidarBrowser_port.set(this, void 0);
        _RPLidarBrowser_portReader.set(this, void 0);
        _RPLidarBrowser_portWriter.set(this, void 0);
        _RPLidarBrowser_portReaderBuffer.set(this, new PortBuffer());
    }
    get serialPortPath() {
        // :(
        return undefined;
    }
    get port() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_port, "f") || (0, util_1.raise)('RPLidar serial port not opened');
    }
    get portReadable() {
        return this.port.readable || (0, util_1.raise)('RPLidar not readable');
    }
    get portWriter() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portWriter, "f") || (0, util_1.raise)('Port not ready');
    }
    get portReader() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReader, "f") || (0, util_1.raise)('Port not ready');
    }
    get native() {
        return navigator.serial || (0, util_1.raise)('Browser not provided access to serial');
    }
    async motorStart() {
        await this.port.setSignals({ dataTerminalReady: false });
        await (0, util_1.delay)(10);
    }
    async motorStop() {
        await this.port.setSignals({ dataTerminalReady: true });
        await (0, util_1.delay)(10);
    }
    async open() {
        if ((0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_port, "f"))
            return (0, util_1.raise)('RPLidar port already opened');
        const port = await this.resolvePort();
        port.addEventListener('disconnect', () => {
            this.resetScanning();
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_port, undefined, "f");
            this.onPortDisconnect();
        });
        await port.open({
            baudRate: driver_base_1.RPLidarDriverBase.portBaudRate,
            bufferSize: driver_base_1.RPLidarDriverBase.portHighWaterMark,
        });
        await port.setSignals({ dataTerminalReady: false });
        (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_port, port, "f");
        (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_portReader, port.readable?.getReader(), "f");
        (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_portWriter, port.writable?.getWriter(), "f");
        await this.onPortPostOpen();
        (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").flush();
        return this;
    }
    async close() {
        if (!(0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_port, "f"))
            return;
        this.resetScanning();
        const port = (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_port, "f");
        if ((0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReader, "f")) {
            (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReader, "f").releaseLock();
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_portReader, undefined, "f");
        }
        if ((0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portWriter, "f")) {
            (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portWriter, "f").releaseLock();
            (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_portWriter, undefined, "f");
        }
        (0, tslib_1.__classPrivateFieldSet)(this, _RPLidarBrowser_port, undefined, "f");
        await (0, util_1.delay)();
        await port.close();
        this.onPortClose();
    }
    async resolvePort() {
        const list = await this.native.getPorts();
        return (list.find((port) => {
            const info = port.getInfo();
            return info.usbVendorId === consts_1.USBVendorId;
        }) ||
            this.native.requestPort({
                filters: [{ usbVendorId: consts_1.USBVendorId }],
            }));
    }
    async doPortReadAll() {
        const reader = this.portReader;
        const v = await reader.read();
        const add = (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").flush();
        return (v.value?.length || 0) + add;
    }
    async doPortRead(len) {
        await this.portReadable;
        const cmd = this.currentCommand;
        const result = new Uint8Array(len);
        const reader = this.portReader;
        while ((0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").size < len) {
            if (this.currentCommand !== cmd)
                return new Uint8Array();
            const { value, done } = await reader.read();
            if (value)
                (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").put(value);
            if (done) {
                await (0, util_1.delay)();
                return result;
            }
        }
        await (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").readTo(result, len);
        return result;
    }
    async doPortWrite(data) {
        const writer = this.portWriter;
        (0, tslib_1.__classPrivateFieldGet)(this, _RPLidarBrowser_portReaderBuffer, "f").flush();
        await writer.write(new Uint8Array(data));
    }
}
exports.RPLidarBrowser = RPLidarBrowser;
_RPLidarBrowser_port = new WeakMap(), _RPLidarBrowser_portReader = new WeakMap(), _RPLidarBrowser_portWriter = new WeakMap(), _RPLidarBrowser_portReaderBuffer = new WeakMap();
class PortBuffer {
    constructor() {
        _PortBuffer_buffer.set(this, new Uint8Array());
    }
    get size() {
        return (0, tslib_1.__classPrivateFieldGet)(this, _PortBuffer_buffer, "f").length;
    }
    put(data) {
        (0, tslib_1.__classPrivateFieldSet)(this, _PortBuffer_buffer, new Uint8Array([...(0, tslib_1.__classPrivateFieldGet)(this, _PortBuffer_buffer, "f"), ...data]), "f");
    }
    async read(len) {
        if (len > this.size)
            (0, util_1.raise)(`Not enough bytes ${len}/${this.size}`);
        const result = (0, tslib_1.__classPrivateFieldGet)(this, _PortBuffer_buffer, "f").slice(0, len);
        (0, tslib_1.__classPrivateFieldSet)(this, _PortBuffer_buffer, (0, tslib_1.__classPrivateFieldGet)(this, _PortBuffer_buffer, "f").slice(len), "f");
        return result;
    }
    async readTo(target, len) {
        const v = await this.read(len);
        for (let i = 0; i < len; i++) {
            target[i] = v[i];
        }
    }
    flush() {
        const result = (0, tslib_1.__classPrivateFieldGet)(this, _PortBuffer_buffer, "f").length;
        (0, tslib_1.__classPrivateFieldSet)(this, _PortBuffer_buffer, new Uint8Array(), "f");
        return result;
    }
}
_PortBuffer_buffer = new WeakMap();
//# sourceMappingURL=browser.js.map