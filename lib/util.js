"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round = exports.delay = exports.raise = void 0;
function raise(message) {
    throw new Error(message);
}
exports.raise = raise;
function delay(ms = 0) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}
exports.delay = delay;
function round(val) {
    return Math.round((val + Number.EPSILON) * 100) / 100;
}
exports.round = round;
//# sourceMappingURL=util.js.map