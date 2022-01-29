import type { EventEmitter } from 'events';

export function raise(message: string): never {
    throw new Error(message);
}

export function waitForEvent<T = unknown>(emitter: EventEmitter, event: string) {
    return new Promise<T>((resolve) => {
        emitter.once(event, resolve);
    });
}

export function delay(ms = 0) {
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}

export function round(val: number) {
    return Math.round((val + Number.EPSILON) * 100) / 100;
}
