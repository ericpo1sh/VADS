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

//Writing data to console
parser.on('data', (data) => {
    console.log(data);
});
