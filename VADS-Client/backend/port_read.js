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

var velocity = 0
var acX = flightData.ax;
var acy = flightData.ay;
velocity = calcSpeed(velocity, acx, acY);

//This Function is to get the velocity of the drone from the acceleration
//prevVel is the previous velocity, should start at 0
//acX is acceleration in X-axis, acY is for the Y-axis
function calcSpeed(prevVel, acX, acY) {
    //acV is the acceleration Vector got through pythagoras
    var accV = Math.sqrt(Math.pow(acX, 2) + Math.pow(acY, 2));
    //newVel is the calculated absolute value of prevVel plus acV times our data refresh interval
    var newVel = Math.abs((prevVel + (acV * 2)));
    return newVel;
}
