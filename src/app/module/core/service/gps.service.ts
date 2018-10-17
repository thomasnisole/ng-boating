import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs/index';
import {Packet, GGAPacket, GSVPacket, RMCPacket} from 'nmea-simple';
import {NmeaService} from './nmea.service';
import {filter, map} from 'rxjs/internal/operators';
import {HttpClient} from '@angular/common/http';
import {Waypoint} from '../model/waypoint.model';
import {NmeaClientService} from './nmea-client.service';

@Injectable()
export class GpsService extends NmeaService {

  private currentWaypoint: BehaviorSubject<Waypoint> = new BehaviorSubject(null);

  public currentWaypoint$: Observable<Waypoint> = EMPTY;

  public constructor(nmeaClientService: NmeaClientService, httpClient: HttpClient) {
    super(nmeaClientService, httpClient);

    this.currentWaypoint$ = this.currentWaypoint;
  }

  public changeCurrentWaypoint(waypoint: Waypoint) {
    this.currentWaypoint.next(waypoint);
  }

  public getGPRMC(): Observable<RMCPacket> {
    return this.nmeaClientService.getSubject('GPRMC').pipe(
      map((packet: Packet) => <RMCPacket>packet)
    );
  }

  public getGPGSV(): Observable<GSVPacket> {
    return this.nmeaClientService.getSubject('GPGSV').pipe(
      map((packet: Packet) => <GSVPacket>packet)
    );
  }

  public getGPGGA(): Observable<GGAPacket> {
    return this.nmeaClientService.getSubject('GPGGA').pipe(
      map((packet: Packet) => <GGAPacket>packet)
    );
  }
}
