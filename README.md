# node-rpi-rgb-led-matrix-simulate

This package provides the same api as node-rpi-rgb-led-matrix but outputs to a
canvas in a browser.

Install with the following command

````npm install therealshark/node-rpi-rgb-led-matrix-simulate````

# Example

```
//const LedMatrix = require("node-rpi-rgb-led-matrix");
const LedMatrix = require("node-rpi-rgb-led-matrix-simulate");

const matrix = new LedMatrix(32, 4);

setInterval(() => {
  const time = new Date().getTime();

  for (let x = 0; x < matrix.getWidth(); x++) {
    for (let y = 0; y < matrix.getHeight(); y++) {
      matrix.setPixel(
        x,
        y,
        Math.floor(Math.sin(time / 200 + x / 50) * 100 + 128),
        Math.floor(Math.sin(time / 400 + y / 50) * 100 + 128),
        Math.floor(Math.sin(time / 100 + x / 50 + y / 50) * 100 + 128)
      );
    }
  }
}, 5);
```
