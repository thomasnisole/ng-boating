import {Injectable} from '@angular/core';

import * as fs from 'fs';
import * as os from 'os';
import * as SerialPort from 'serialport';

@Injectable()
export class ElectronService {

  public fs: typeof fs;

  public os: typeof os;

  public SerialPort: typeof SerialPort;

  constructor() {
    if (this.isElectron()) {
      this.fs = window.require('fs');
      this.os = window.require('os');
      this.SerialPort = window.require('serialport');
    }
  }

  public isElectron(): boolean {
    return window && window.process && window.process.type;
  }
}
