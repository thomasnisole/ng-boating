import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/index';
import {GGAPacket, GSVPacket, parseNmeaSentence, RMCPacket} from 'nmea-simple';
import {NmeaService} from './nmea.service';
import {filter, map, distinctUntilChanged} from 'rxjs/internal/operators';
import {HttpClient} from '@angular/common/http';
import {Socket} from 'ngx-socket-io';
import {Waypoint} from '../model/waypoint.model';
import * as _ from 'underscore';

@Injectable()
export class GpsService extends NmeaService {

  private getGSV$: Observable<GSVPacket>;

  private getRMC$: Observable<RMCPacket>;

  private getGGA$: Observable<GGAPacket>;

  private currentWaypoint$: Subject<Waypoint>;

  public constructor(socket: Socket, httpClient: HttpClient) {
    super(socket, httpClient);
  }

  public getGSVData(): Observable<GSVPacket> {
    if (!this.getGSV$) {
      this.getGSV$ = this.getDataAsString().pipe(
        filter((line: string) => line.startsWith('$GPGSV')),
        map((line: string) => <GSVPacket>parseNmeaSentence(line)),
        distinctUntilChanged((a, b) => _.isEqual(a, b)),
      );
    }

    return this.getGSV$;
  }

  public getRMCData(): Observable<RMCPacket> {
    if (!this.getRMC$) {
      this.getRMC$ = this.getDataAsString().pipe(
        filter((line: string) => line.startsWith('$GPRMC')),
        map((line: string) => <RMCPacket>parseNmeaSentence(line)),
        distinctUntilChanged((a, b) => _.isEqual(a, b)),
      );
    }

    return this.getRMC$;
  }

  public getGGAData(): Observable<GGAPacket> {
    if (!this.getGGA$) {
      this.getGGA$ = this.getDataAsString().pipe(
        filter((line: string) => line.startsWith('$GPGGA')),
        map((line: string) => <GGAPacket>parseNmeaSentence(line)),
        distinctUntilChanged((a, b) => _.isEqual(a, b)),
      );
    }

    return this.getGGA$;
  }

  public getCurrentWaypoint(): Subject<Waypoint> {
    if (!this.currentWaypoint$) {
      this.currentWaypoint$ = new Subject();
    }

    return this.currentWaypoint$;
  }

  public changeCurrentWaypoint(waypoint: Waypoint) {
    if (!this.currentWaypoint$) {
      this.currentWaypoint$ = new Subject();
    }

    this.currentWaypoint$.next(waypoint);
  }
}
