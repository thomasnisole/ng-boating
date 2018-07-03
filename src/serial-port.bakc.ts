const remote = (<any>window).require('electron').remote;
export const fs = remote.require('fs');

export class SerialPort {

  public constructor(port, options: any) {

  }

  public static list(): Promise<any[]> {
    return new Promise((resolve, reject) => resolve([
      {
        comName: 'COM4',
        locationId: 'Port_#0002.Hub_#0002',
        manufacturer: 'Silicon Labs',
        pnpId: 'USB\\VID_10C4&PID_EA60\\0001',
        productId: 'EA60',
        serialNumber: '0001',
        vendorId: '10C4'
      },
      {
        comName: 'COM5',
        locationId: 'Port_#0002.Hub_#0002',
        manufacturer: 'Silicon Labs',
        pnpId: 'USB\\VID_10C4&PID_EA60\\0001',
        productId: 'EA60',
        serialNumber: '0001',
        vendorId: '10C4'
      }
    ]));
  }

  public pipe(parser: typeof parsers.Readline): void {

  }

  public open(fn: (string) => void): void {
    fn(null);
    setInterval(() => {
      serialPortObjects.parser.emit('data');
    }, 1000);
  }

  public close(fn: (string) => void): void {
    fn(null);
  }
}

class Readline {

  private index: number = 0;

  private fns: {[key: string]: any[]} = {};

  public on(eventName: string, fn: any): void {
    if (!this.fns[eventName]) {
      this.fns[eventName] = [];
    }

    this.fns[eventName].push(fn);
  }

  public emit(eventName: string): void {
    switch (eventName) {
      case 'data':
        const lines: string[] = fs.readFileSync('./src/data.nmea').toString().split('\r\n');
        if (this.index === lines.length) {
          this.index = 0;
        }

        this.fns[eventName].forEach((fn) => {
          fn(lines[this.index]);
        });
        this.index++;
    }
  }
}

export const parsers: any = {
  Readline: Readline
};

export class SerialPortObjects {

  public port: SerialPort = null;

  public parser: typeof parsers.Readline = null;
}

export const serialPortObjects: SerialPortObjects = new SerialPortObjects();
