const Sender = (() => {
  const app = require("express")();
  const http = require("http").Server(app);
  const io = require("socket.io")(http);
  const port = process.env.PORT || 3000;
  let lastData = [];
  let updateQueued = false;

  app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
  });

  http.listen(port, function() {
    console.log("open http://localhost:" + port + " to see LED Simulation");
  });

  const sendData = data => {
    if (data) {
      lastData = data;
    }
    if (updateQueued == false) {
      updateQueued = true;
      setTimeout(actuallySendData, 20);
    }
  };

  const actuallySendData = () => {
    if (lastData) {
      io.emit("update", lastData);
      updateQueued = false;
    }
  };

  io.on("connection", function(socket) {
    sendData();
  });

  return {
    sendData
  };
})();

const toInt = (red, green, blue) => (red << 16) + (green << 8) + blue;

const LedMatrix = function(
  rows = 32,
  chainedDisplays = 1,
  parallelDisplays = 1
) {
  this.width = chainedDisplays * 32;
  this.height = rows * parallelDisplays;
  this._data = [];
  for (let x = 0; x < this.width; x++) {
    this._data.push([]);
  }
  this.clear();
};

LedMatrix.prototype.getWidth = function() {
  return this.width;
};

LedMatrix.prototype.getHeight = function() {
  return this.height;
};

LedMatrix.prototype.fill = function(red, green, blue) {
  const color = toInt(red, green, blue);
  for (let x = 0; x < this.width; x++) {
    for (let y = 0; y < this.height; y++) {
      this._data[x][y] = color;
    }
  }
  Sender.sendData(this._data);
};

LedMatrix.prototype.setPixel = function(x, y, red, green, blue) {
  this._data[x][y] = toInt(red, green, blue);
  Sender.sendData(this._data);
};

LedMatrix.prototype.clear = function() {
  this.fill(0, 0, 0);
};

module.exports = LedMatrix;
