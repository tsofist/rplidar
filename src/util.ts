export function raise(message: string): never {
    throw new Error(message);
}

export function delay(ms = 0) {
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}

export function round(val: number) {
    return Math.round((val + Number.EPSILON) * 100) / 100;
}
