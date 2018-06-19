"use strict";
exports.__esModule = true;
var remote = window.require('electron').remote;
exports.SerialPort = remote.require('serialport');
exports.parsers = exports.SerialPort.parsers;
var SerialPortObjects = /** @class */ (function () {
    function SerialPortObjects() {
        this.port = null;
        this.parser = null;
    }
    return SerialPortObjects;
}());
exports.SerialPortObjects = SerialPortObjects;
exports.serialPortObjects = new SerialPortObjects();
