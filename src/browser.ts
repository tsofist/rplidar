import { Readable } from 'stream';
import { USBVendorId } from './consts';
import { RPLidarDriverBase } from './driver-base';
import { delay, raise } from './util';

export class RPLidarBrowser extends RPLidarDriverBase {
    #port: BrowserSerialPort | undefined;
    #portReader: BrowserSerialPortReader | undefined;
    #portWriter: BrowserSerialPortWriter | undefined;
    #portReaderBuffer = new PortBuffer();

    get serialPortPath() {
        // :(
        return undefined;
    }

    protected get port() {
        return this.#port || raise('RPLidar serial port not opened');
    }

    protected get portReadable() {
        return this.port.readable || raise('RPLidar not readable');
    }

    protected get portWriter() {
        return this.#portWriter || raise('Port not ready');
    }

    protected get portReader() {
        return this.#portReader || raise('Port not ready');
    }

    protected get native(): NavigatorSerial {
        return (navigator as any).serial || raise('Browser not provided access to serial');
    }

    async motorStart() {
        await this.port.setSignals({ dataTerminalReady: false });
        await delay(10);
    }

    async motorStop() {
        await this.port.setSignals({ dataTerminalReady: true });
        await delay(10);
    }

    async open() {
        if (this.#port) return raise('RPLidar port already opened');
        const port = await this.resolvePort();

        port.addEventListener('disconnect', () => {
            this.resetScanning();
            this.#port = undefined;
            this.onPortDisconnect();
        });

        await port.open({
            baudRate: RPLidarDriverBase.portBaudRate,
            bufferSize: RPLidarDriverBase.portHighWaterMark,
        });

        await port.setSignals({ dataTerminalReady: false });

        this.#port = port;
        this.#portReader = port.readable?.getReader();
        this.#portWriter = port.writable?.getWriter();

        await this.onPortPostOpen();
        this.#portReaderBuffer.flush();

        return this;
    }

    async close() {
        if (!this.#port) return;

        this.resetScanning();
        const port = this.#port;

        if (this.#portReader) {
            this.#portReader.releaseLock();
            this.#portReader = undefined;
        }
        if (this.#portWriter) {
            this.#portWriter.releaseLock();
            this.#portWriter = undefined;
        }

        this.#port = undefined;

        await delay();
        await port.close();
        this.onPortClose();
    }

    protected async resolvePort() {
        const list = await this.native.getPorts();
        return (
            list.find((port) => {
                const info = port.getInfo();
                return info.usbVendorId === USBVendorId;
            }) ||
            this.native.requestPort({
                filters: [{ usbVendorId: USBVendorId }],
            })
        );
    }

    protected async doPortReadAll(): Promise<number> {
        const reader = this.portReader;
        const v = await reader.read();
        const add = this.#portReaderBuffer.flush();
        return (v.value?.length || 0) + add;
    }

    protected async doPortRead(len: number): Promise<Uint8Array> {
        await this.portReadable;
        const cmd = this.currentCommand;
        const result = new Uint8Array(len);
        const reader = this.portReader;
        while (this.#portReaderBuffer.size < len) {
            if (this.currentCommand !== cmd) return new Uint8Array();
            const { value, done } = await reader.read();
            if (value) this.#portReaderBuffer.put(value);
            if (done) {
                await delay();
                return result;
            }
        }
        await this.#portReaderBuffer.readTo(result, len);
        return result;
    }

    protected async doPortWrite(data: number[]): Promise<void> {
        const writer = this.portWriter;
        this.#portReaderBuffer.flush();
        await writer.write(new Uint8Array(data));
    }
}

interface NavigatorSerial {
    getPorts(): Promise<BrowserSerialPort[]>;

    requestPort(options: {
        filters: {
            usbProductId?: number;
            usbVendorId?: number;
        }[];
    }): Promise<BrowserSerialPort | never>;
}

interface BrowserSerialPort {
    writable?: {
        readonly locked: boolean;
        abort(): Promise<void>;
        getWriter(): BrowserSerialPortWriter;
    };
    readable?: Readable & {
        readonly locked: boolean;
        cancel(): Promise<void>;
        getReader(): BrowserSerialPortReader;
        tee(): any;
        pipeTo(target: any): any;
    };

    getInfo(): { usbProductId: number; usbVendorId: number };

    open(options: { baudRate: number; bufferSize: number }): Promise<void>;

    close(): Promise<void>;

    setSignals(options: { dataTerminalReady: boolean }): Promise<void>;

    addEventListener(event: string, handler: (data: any) => void): this;
}

interface BrowserSerialPortReader {
    read(a?: any): Promise<{ done: boolean; value: null | Uint8Array }>;

    releaseLock(): void;

    cancel(): Promise<void>;
}

interface BrowserSerialPortWriter {
    write(data: Uint8Array): Promise<void>;

    releaseLock(): void;

    cancel(): Promise<void>;
}

class PortBuffer {
    #buffer = new Uint8Array();

    get size() {
        return this.#buffer.length;
    }

    put(data: Uint8Array) {
        this.#buffer = new Uint8Array([...this.#buffer, ...data]);
    }

    async read(len: number) {
        if (len > this.size) raise(`Not enough bytes ${len}/${this.size}`);
        const result = this.#buffer.slice(0, len);
        this.#buffer = this.#buffer.slice(len);
        return result;
    }

    async readTo(target: Uint8Array, len: number) {
        const v = await this.read(len);
        for (let i = 0; i < len; i++) {
            target[i] = v[i];
        }
    }

    flush() {
        const result = this.#buffer.length;
        this.#buffer = new Uint8Array();
        return result;
    }
}
