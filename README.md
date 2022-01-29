# nodejs driver for [slamtec RPLidar](https://www.slamtec.com/en/Lidar)

This driver tested only on [A1](https://www.slamtec.com/en/Lidar/A1Spec).

## Usage

```ts
const lidar = new RPLidar();

console.log('Opening lidar port..');

await lidar.open();
// Lidar spinning by default
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
