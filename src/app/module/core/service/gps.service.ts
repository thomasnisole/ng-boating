import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/index';
import {GSVPacket, RMCPacket} from 'nmea-simple';
import {NmeaService} from './nmea.service';
import {filter, map, tap} from 'rxjs/internal/operators';
import {decodeSentence as decodeGSVSentence} from 'nmea-simple/dist/codecs/GSV';
import {decodeSentence as decodeRMCSentence} from 'nmea-simple/dist/codecs/RMC';
import {HttpClient} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';

@Injectable()
export class GpsService extends NmeaService {

  private getGSV$: Observable<GSVPacket>;

  private getRMC$: Observable<RMCPacket>;

  public constructor(private socket: Socket, private httpClient: HttpClient) {
    super(socket, httpClient);
  }

  public getGSVData(): Observable<GSVPacket> {
    if (!this.getGSV$) {
      this.getGSV$ = this.getDataAsString().pipe(
        filter((line: string) => line.startsWith('$GPGSV')),
        map((line: string) => decodeGSVSentence(line))
      );
    }

    return this.getGSV$;
  }

  public getRMCData(): Observable<RMCPacket> {
    if (!this.getRMC$) {
      this.getRMC$ = this.getDataAsString().pipe(
        filter((line: string) => line.startsWith('$GPRMC')),
        map((line: string) => decodeRMCSentence(line)),
      );
    }

    return this.getRMC$;
  }
}
