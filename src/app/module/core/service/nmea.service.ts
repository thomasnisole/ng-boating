import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {Port} from '../model/port.model';
import {map} from 'rxjs/internal/operators';
import {environment} from '../../../../environments/environment';
import {Packet} from 'nmea-simple';
import {NmeaClientService} from './nmea-client.service';

export abstract class NmeaService {

  public constructor(protected nmeaClientService: NmeaClientService, protected httpClient: HttpClient) {}

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

  public getAll(): Observable<string> {
    return <Observable<string>>this.nmeaClientService.getSubject('ALL');
  }
}
