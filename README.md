# NodeJS (and Web Serial API) driver for [slamtec RPLidar](https://www.slamtec.com/en/Lidar)

Please note: *this driver tested only on [A1](https://www.slamtec.com/en/Lidar/A1Spec) (but it will certainly suit
advanced models without significant problems).*

Yep, you can use the driver both in NodeJS and even in your browser at almost maximum design speeds ([~440RPM for A1](./demo/index.html))!

## Installing
```ts
// Usual module for NodeJS
import {RPLidar} from '@tsofist/rplidar';

// Usual module (for bundling) for Browser
import {RPLidarBrowser} from '@tsofist/rplidar';

// Independent module for Browser (as esm/cjs module)
import {RPLidarBrowser} from '@tsofist/rplidar/lib/rplidar-browser.esm.js';
import {RPLidarBrowser} from '@tsofist/rplidar/lib/rplidar-browser.js';

// Independent module for Browser from CDN as esm
import {RPLidarBrowser} from 'https://unpkg.com/@tsofist/rplidar/lib/rplidar-browser.esm.js';
```

## Usage

```ts
const lidar = new RPLidar();

console.log('Opening lidar port..');

await lidar.open();
await lidar.motorStop();

console.log(`RPLidar ready on "${lidar.serialPortPath}"`);
console.log(`Lidar Info:`, await lidar.getInfo());
console.log(`Device health:`, await lidar.getHealth());
console.log(`Lidar samples rates:`, await lidar.getSamplesRate());
console.log(`Lidar scanning modes:`, await lidar.listScanModes());

lidar.on(`scan:sample`, (sample: RPLidarScanSample) => {
  console.log(`Scan sample:`, sample);
  console.log(`Actual speed: ${lidar.scanningRPM}RPM (${lidar.scanningHz}Hz)`);
});

console.log(`Start scanning..`);

await lidar.motorStart();
await lidar.scanStart();

await delay(5_000);

console.log(`Stop scanning..`);

await lidar.scanStop();
await lidar.motorStop();

await delay(3_000);

await lidar.close();

console.log(`Lidar port closed`);

```
