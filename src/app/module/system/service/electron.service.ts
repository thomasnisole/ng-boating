import {Injectable} from '@angular/core';

import * as fs from 'fs';
import * as os from 'os';
import * as SerialPort from 'serialport';
import * as child_process from 'child_process';

@Injectable()
export class ElectronService {

  public fs: typeof fs;

  public os: typeof os;

  public SerialPort: typeof SerialPort;

  public childProcess: typeof child_process;

  constructor() {
    if (this.isElectron()) {
      this.fs = window.require('fs');
      this.os = window.require('os');
      this.SerialPort = window.require('serialport');
      this.childProcess = window.require('child_process');
    }
  }

  public isElectron(): boolean {
    return window && window.process && window.process.type;
  }
}
