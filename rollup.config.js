const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const nodePolyfills = require('rollup-plugin-polyfill-node');

module.exports = {
    input: 'lib/browser.js',
    output: {
        file: 'lib/rplidar-browser.esm.js',
        format: 'es',
    },
    plugins: [nodePolyfills(), nodeResolve({ browser: true }), commonjs()],
};
