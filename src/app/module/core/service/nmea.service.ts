import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {Port} from '../model/port.model';
import {map} from 'rxjs/internal/operators';
import {environment} from '../../../../environments/environment';
import {NmeaServerService} from './nmea-server.service';

@Injectable()
export class NmeaService {

  public dataAsString$: Observable<string> = EMPTY;

  public constructor(private nmeaServerService: NmeaServerService, private httpClient: HttpClient) {
    this.dataAsString$ = this.nmeaServerService.data$;
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
}
