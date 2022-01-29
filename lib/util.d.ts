/// <reference types="node" />
import type { EventEmitter } from 'events';
export declare function raise(message: string): never;
export declare function waitForEvent<T = unknown>(emitter: EventEmitter, event: string): Promise<T>;
export declare function delay(ms?: number): Promise<void>;
export declare function round(val: number): number;
