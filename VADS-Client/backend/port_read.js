const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { DelimiterParser } = require('@serialport/parser-delimiter');
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 3030;

// Set the serial port path
const serialPortPath = "/dev/ttyUSB0";

try {
  // verifying if the serial port path exists
  const fs = require('fs');
  if (!fs.existsSync(serialPortPath)) {
    throw new Error(`Serial port path does not exist: ${serialPortPath}`);
  }

  // Set up the serial port
  const serialPort = new SerialPort({
    path: "/dev/ttyUSB0",
    baudRate: 57600, // speed 57600 baud
  });
  serialPort.on('open', () => {
    console.log("Serial port opened successfully.");
  });

  serialPort.on('error', (err) => {
    console.error("Error opening serial port:", err.message);
  });

  // Set up the parser and pipe data into it
  const parser = serialPort.pipe(new ReadlineParser());

  let flightData = {};

  let velocity = 0;
  parser.on('data', (data) => {
    try {
      flightData = JSON.parse(data);
      console.log(flightData);
      const acX = flightData.accel.x;
      const acY = flightData.accel.y;
      velocity = calcSpeed(velocity, acX, acY);
      flightData.velocity = velocity;
      console.log("Updated Flight Data:", flightData);
    } catch (error) {
      console.error("Unexpected characters received in data");
    }
  });

  function calcSpeed(prevVel, acX, acY) {
    if (isNaN(acX) || isNaN(acY)) {
      console.error("Invalid acceleration values:", { acX, acY });
      return prevVel;
    }
    const accV = Math.sqrt(Math.pow(acX, 2) + Math.pow(acY, 2));
    return Math.round((Math.abs(accV * 2) + Number.EPSILON) * 1000000) / 1000000;
  }

  app.get("/api/flight-data", (req, res) => {
    res.json(flightData);
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

} catch (error) {
  console.error("Failed to initialize serial port:", error.message);
}

app.get('/ping', (req, res) => {
  res.send('Server is active');
});

