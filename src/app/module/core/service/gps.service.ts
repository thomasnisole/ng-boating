import {Injectable} from '@angular/core';
import {Observable, Observer, of} from 'rxjs/index';
import {Port} from '../model/port.model';
import {parsers, SerialPort, serialPortObjects} from '../../../../serial-port';
import {GSVPacket, Packet, parseNmeaSentence, RMCPacket} from 'nmea-simple';

@Injectable()
export class GpsService {

  private isOpen: boolean = false;

  public constructor() {}

  public findAllPorts(): Observable<Port[]> {
    return Observable.create((obs: Observer<Port[]>) => {
      SerialPort
        .list()
        .then(ports => obs.next(ports.map((port: any) => new Port(
            port.comName,
            port.manufacturer,
            port.pnpId
          )))
        )
        .catch(err => obs.error(err));
    });
  }

  public close(): Observable<boolean> {
    if (!serialPortObjects.port) {
      of(false);
    }

    return Observable.create((observer: Observer<boolean>) => {
      serialPortObjects.port.close((err) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(true);
        }

        observer.complete();
      });
    });
  }

  public open(baudRate: number, port: string): Observable<boolean> {
    if (this.isOpen) {
      return of(true);
    }

    return Observable.create((observer: Observer<boolean>) => {
      serialPortObjects.parser = new parsers.Readline({
        delimiter: '\r\n'
      });

      serialPortObjects.port = new SerialPort(port, {
        autoOpen: false,
        baudRate: baudRate,
        lock: false
      });
      serialPortObjects.port.pipe(serialPortObjects.parser);

      new Promise((resolve, reject) => {
        serialPortObjects.port.open((err) => {
          if (err) {
            reject(err);
          } else {
            this.isOpen = true;
            resolve();
          }
        });
      })
        .then(() => observer.next(true))
        .catch((err) => observer.error(err));
    });
  }

  public getDataAsString(): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      serialPortObjects.parser.on('data', (line: string) => {
        observer.next(line);
      });
    });
  }

  public getGSVData(): Observable<GSVPacket> {
    return Observable.create((observer: Observer<GSVPacket>) => {
      serialPortObjects.parser.on('data', (line: string) => {
        observer.next(<GSVPacket>parseNmeaSentence(line));
      });
    });
  }

  public getRMCData(): Observable<RMCPacket> {
    return Observable.create((observer: Observer<RMCPacket>) => {
      serialPortObjects.parser.on('data', (line: string) => {
        const packet: Packet = parseNmeaSentence(line);
        if (packet.sentenceId === 'RMC') {
          observer.next(<RMCPacket>packet);
        }
      });
    });
  }
}
