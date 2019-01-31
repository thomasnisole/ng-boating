import {Observable} from 'rxjs';
import {Port} from '../model/port.model';
import {map} from 'rxjs/internal/operators';
import {NmeaClientService} from './nmea-client.service';

export abstract class NmeaService {

  public constructor(protected nmeaClientService: NmeaClientService) {
  }

  public findAllPorts(): Observable<Port[]> {
    return this.nmeaClientService.findAllPorts()
      .pipe(
        map((ports: any) => ports.map((port: any) => new Port(
          port.comName,
          port.manufacturer,
          port.pnpId
        )))
      );
  }

  public getAll(): Observable<string> {
    return this.nmeaClientService.getPacket();
  }
}
