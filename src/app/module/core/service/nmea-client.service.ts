import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {SerialPort, parsers} from 'serialport';
import {ElectronService} from '../../system/service/electron.service';
import {fromPromise} from 'rxjs/internal-compatibility';
import {filter} from 'rxjs/operators';

@Injectable()
export class NmeaClientService {

  private parser: parsers.Readline;

  private port: SerialPort;

  private connected$: BehaviorSubject<boolean>;

  private error$: BehaviorSubject<string>;

  private packet: Subject<string>;

  public constructor(private electronService: ElectronService, private zone: NgZone) {
    this.parser = new electronService.SerialPort.parsers.Readline({
      delimiter: '\r\n'
    });
    this.parser.on('data', (line) => {
      // fs.appendFileSync('C:/tmp/trace.nmea', line.toString() + '\r\n');
      this.zone.run(() => this.packet.next(line));
    });

    this.connected$ = new BehaviorSubject(false);
    this.error$ = new BehaviorSubject(null);
    this.packet = new BehaviorSubject(null);
  }

  public findAllPorts(): Observable<any[]> {
    return fromPromise(this.electronService.SerialPort.list());
  }

  public open(baudRate: number, port: string): Observable<boolean> {
    console.log('open', baudRate, port);
    this.port = new this.electronService.SerialPort(
      port,
      {
        autoOpen: false,
        baudRate: baudRate,
        lock: false
      },
      (err) => {
        if (err) {
          this.port = null;

          this.connected$.next(false);
          this.connected$.thrownError(err.toString());
          this.error$.next(err);
        } else {
          console.log('opened', port);
          this.connected$.next(true);
        }
      }
    );

    this.port.on('close', () => {
      console.log('closed', port);
      this.connected$.next(false);
    });

    this.port.pipe(this.parser);

    this.port.open();

    return this.connected$;
  }

  public close(): void {
    this.port.close(() => {
      this.connected$.next(false);
      this.port = null;
    });
  }

  public onError(): Observable<string> {
    return this.error$.pipe(
      filter((err) => !!err)
    );
  }

  public getPacket(): Observable<string> {
    return this.packet.pipe(
      filter((line: string) => line != null && line !== '')
    );
  }
}
