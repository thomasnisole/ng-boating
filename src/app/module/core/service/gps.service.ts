import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs/index';
import {GGAPacket, GSVPacket, RMCPacket, parseNmeaSentence} from 'nmea-simple';
import {NmeaService} from './nmea.service';
import {catchError, map} from 'rxjs/internal/operators';
import {HttpClient} from '@angular/common/http';
import {Waypoint} from '../model/waypoint.model';
import {NmeaServerService} from './nmea-server.service';

@Injectable()
export class GpsService extends NmeaService {

  private currentWaypoint: BehaviorSubject<Waypoint> = new BehaviorSubject(null);

  public dataAsRMC$: Observable<RMCPacket> = EMPTY;

  public dataAsGSV$: Observable<GSVPacket> = EMPTY;

  public dataAsGGA$: Observable<GGAPacket> = EMPTY;

  public currentWaypoint$: Observable<Waypoint> = EMPTY;

  public constructor(nmeaServerService: NmeaServerService, httpClient: HttpClient) {
    super(nmeaServerService, httpClient);

    this.dataAsRMC$ = this.dataAsString$.pipe(
      map((line: string) => <RMCPacket>parseNmeaSentence(line)),
      catchError((err: string) => EMPTY)
    );
    this.dataAsGSV$ = this.dataAsString$.pipe(
      map((line: string) => <GSVPacket>parseNmeaSentence(line)),
      catchError((err: string) => EMPTY)
    );
    this.dataAsGGA$ = this.dataAsString$.pipe(
      map((line: string) => <GGAPacket>parseNmeaSentence(line)),
      catchError((err: string) => EMPTY)
    );

    this.currentWaypoint$ = this.currentWaypoint;
  }

  public changeCurrentWaypoint(waypoint: Waypoint) {
    this.currentWaypoint.next(waypoint);
  }
}
