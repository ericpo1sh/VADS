  // Importing dependencies
  const { Serialport } = require("serialport");
  const { Readline } = require("@serialport/parser-readline");
  const express = require("express");
  const cors = require("cors");

  // Initialize Express app
  const app = express();
  app.use(cors());
  const port = 3030;

  // Set up the serial port
  const serialPort = new Serialport("/dev/ttyUSB0", {
      baudRate: 57600,
  });

  // Set up the parser and pipe data into it
  const parser = serialPort.pipe(new Readline({ delimiter: '\n' }));

  // Variables to store flight data
  let flightData = {};
  let velocity = 0;

  // Parse and process incoming serial data
  parser.on('data', (data) => {
    try {
        // Parse the incoming data
        flightData = JSON.parse(data);

        // Extract acceleration values
        const acX = flightData.ax;
        const acY = flightData.ay;

        // Calculate velocity
        velocity = calcSpeed(velocity, acX, acY);

        // Add velocity to flight data
        flightData.velocity = velocity;

        console.log("Updated Flight Data:", flightData);
    } catch (error) {
        console.error("Error parsing data:", error);
    }
  });

  // Function to calculate the velocity of the drone from the acceleration
  function calcSpeed(prevVel, acX, acY) {
      if (isNaN(acX) || isNaN(acY)) {
          console.error("Invalid acceleration values:", { acX, acY });
          return prevVel;
      }

      // Calculate the acceleration vector using Pythagoras
      const accV = Math.sqrt(Math.pow(acX, 2) + Math.pow(acY, 2));

      // Calculate new velocity (absolute value of the updated velocity)
      const newVel = Math.abs(prevVel + accV * 2); // Assuming 2 as a data refresh interval

      return newVel;
  }

  // REST API endpoint to serve the latest flight data
  app.get("/api/flight-data", (req, res) => {
      res.json(flightData); // Send the latest flight data as JSON
  });

  // Start the Express server
  app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
  });
