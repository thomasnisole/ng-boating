import { Injectable } from '@angular/core';
import {Observable, Observer, of, Subject} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {Port} from '../model/port.model';
import {map, tap} from 'rxjs/internal/operators';
import {Socket} from 'ngx-socket-io';

@Injectable()
export class NmeaService {

  private getData$: Subject<string>;

  public constructor(private socket: Socket, private httpClient: HttpClient) {}

  public findAllPorts(): Observable<Port[]> {
    return this.httpClient
      .get('http://localhost:80/nmea-ports')
      .pipe(
        map((ports: any) => ports.map((port: any) => new Port(
          port.comName,
          port.manufacturer,
          port.pnpId
        )))
      );
  }

  public close(): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => this.socket.emit('close', () => observer.next(false)));
  }

  public open(baudRate: number, port: string): Observable<boolean> {
    return new Observable((observer: Observer<boolean>) => {
      this.socket.on('close', () => {
        observer.error('Close port');
      });
      this.socket.emit(
        'open',
        {baudRate: baudRate, port: port},
        (err) => {
          if (err) {
            observer.error(err);
          } else {
            observer.next(true);
          }

          observer.complete();
        });
    });
  }

  public getDataAsString(): Observable<string> {
    if (!this.getData$) {
      this.getData$ = new Subject();

      this.socket.on('data', (line: string) => {
        this.getData$.next(line);
      });
    }

    return this.getData$;
  }
}
