const remote = (<any>window).require('electron').remote;
export const SerialPort = remote.require('serialport');
export const parsers = SerialPort.parsers;

export class SerialPortObjects {

  public port: typeof SerialPort = null;

  public parser: typeof parsers.Readline = null;
}

export const serialPortObjects: SerialPortObjects = new SerialPortObjects();

console.log(serialPortObjects);
