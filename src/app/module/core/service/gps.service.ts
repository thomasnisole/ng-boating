import {Injectable} from '@angular/core';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs';
import {NmeaService} from './nmea.service';
import {Waypoint} from '../model/waypoint.model';
import {NmeaClientService} from './nmea-client.service';
import {GGAPacket, GLLPacket, GSAPacket, GSVPacket, Packet, parseNmeaSentence, RMCPacket, VTGPacket} from 'nmea-simple';
import {filter, map} from 'rxjs/operators';

@Injectable()
export class GpsService extends NmeaService {

  private currentWaypoint: BehaviorSubject<Waypoint> = new BehaviorSubject(null);

  public constructor(nmeaClientService: NmeaClientService) {
    super(nmeaClientService);
  }

  public changeCurrentWaypoint(waypoint: Waypoint) {
    this.currentWaypoint.next(waypoint);
  }

  public getCurrentWaypoint(): Observable<Waypoint> {
    return this.currentWaypoint;
  }

  public getPacket(): Observable<Packet> {
    return this.nmeaClientService.getPacket().pipe(
      filter((line: string) => line.startsWith('$GP')),
      map((line: string) => parseNmeaSentence(line))
    );
  }

  public getGPGGA(): Observable<GGAPacket> {
    return this.nmeaClientService.getPacket().pipe(
      filter((line: string) => line.startsWith('$GPGGA')),
      map((line: string) => <GGAPacket>parseNmeaSentence(line))
    );
  }

  public getGPGLL(): Observable<GLLPacket> {
    return this.nmeaClientService.getPacket().pipe(
      filter((line: string) => line.startsWith('$GPGLL')),
      map((line: string) => <GLLPacket>parseNmeaSentence(line))
    );
  }

  public getGPGSA(): Observable<GSAPacket> {
    return this.nmeaClientService.getPacket().pipe(
      filter((line: string) => line.startsWith('$GPGSA')),
      map((line: string) => <GSAPacket>parseNmeaSentence(line))
    );
  }

  public getGPGSV(): Observable<GSVPacket> {
    return this.nmeaClientService.getPacket().pipe(
      filter((line: string) => line.startsWith('$GPGSV')),
      map((line: string) => <GSVPacket>parseNmeaSentence(line)),
    );
  }

  public getGPVTG(): Observable<VTGPacket> {
    return this.nmeaClientService.getPacket().pipe(
      filter((line: string) => line.startsWith('$GPVTG')),
      map((line: string) => <VTGPacket>parseNmeaSentence(line)),
    );
  }

  public getGPRMC(): Observable<RMCPacket> {
    return this.nmeaClientService.getPacket().pipe(
      filter((line: string) => line.startsWith('$GPRMC')),
      map((line: string) => <RMCPacket>parseNmeaSentence(line))
    );
  }
}
