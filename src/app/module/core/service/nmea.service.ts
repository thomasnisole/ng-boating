import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Observer} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {Port} from '../model/port.model';
import {filter, map, tap} from 'rxjs/internal/operators';
import {Socket} from 'ngx-socket-io';
import {environment} from '../../../../environments/environment';

@Injectable()
export class NmeaService {

  private data: BehaviorSubject<string> = new BehaviorSubject(null);

  public data$: Observable<string>;

  public constructor(private socket: Socket, private httpClient: HttpClient) {
    this.data$ = this.data.pipe(
      filter((line: string) => line != null)
    );
  }


  public findAllPorts(): Observable<Port[]> {
    return this.httpClient
      .get(environment.backendUrl + 'nmea-ports')
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

      this.socket.on('data', (line: string) => {
        console.log(line);
        this.data.next(line);
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
}
