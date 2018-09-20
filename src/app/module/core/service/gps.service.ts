import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs/index';
import {GGAPacket, GSVPacket, parseNmeaSentence, RMCPacket} from 'nmea-simple';
import {NmeaService} from './nmea.service';
import {filter, map, distinctUntilChanged, tap} from 'rxjs/internal/operators';
import {HttpClient} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {Waypoint} from '../model/waypoint.model';
import * as _ from 'underscore';

@Injectable()
export class GpsService extends NmeaService {

  private currentWaypoint: BehaviorSubject<Waypoint> = new BehaviorSubject(null);

  private getGSV$: Observable<GSVPacket>;

  private getRMC$: Observable<RMCPacket>;

  private getGGA$: Observable<GGAPacket>;

  public currentWaypoint$: Observable<Waypoint> = EMPTY;

  public constructor(socket: Socket, httpClient: HttpClient) {
    super(socket, httpClient);

    this.currentWaypoint$ = this.currentWaypoint;
  }

  public getGSVData(): Observable<GSVPacket> {
    if (!this.getGSV$) {
      this.getGSV$ = this.data$.pipe(
        filter((line: string) => line.startsWith('$GPGSV')),
        map((line: string) => <GSVPacket>parseNmeaSentence(line)),
        distinctUntilChanged((a, b) => _.isEqual(a, b)),
      );
    }

    return this.getGSV$;
  }

  public getRMCData(): Observable<RMCPacket> {
    if (!this.getRMC$) {
      this.getRMC$ = this.data$.pipe(
        filter((line: string) => line.startsWith('$GPRMC')),
        map((line: string) => <RMCPacket>parseNmeaSentence(line)),
        distinctUntilChanged((a, b) => _.isEqual(a, b)),
      );
    }

    return this.getRMC$;
  }

  public getGGAData(): Observable<GGAPacket> {
    if (!this.getGGA$) {
      this.getGGA$ = this.data$.pipe(
        filter((line: string) => line.startsWith('$GPGGA')),
        map((line: string) => <GGAPacket>parseNmeaSentence(line)),
        distinctUntilChanged((a, b) => _.isEqual(a, b)),
      );
    }

    return this.getGGA$;
  }

  public changeCurrentWaypoint(waypoint: Waypoint) {
    this.currentWaypoint.next(waypoint);
  }
}
