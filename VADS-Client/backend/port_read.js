// importing dependencies
const Serialport = require("serialport");
const Readline = require("@serialport/parser-readline");

//Set serial port
const port = new Serialport("/dev/ttyUSB0", {
    baudrate: 57600,
});

//Set parser and pip in port
const parser = new Readline();
port.pipe(parser);

//Data to JSON for calling in Components
parser.on('data', (data) => {
    try {
        const flightData = JSON.parse(data);
        console.log("Converted Parsed line to JSON");
    }
    catch (error) {
        console.log(error);
    }
});
