import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/internal/operators';
import {GpsService} from '../../module/core/service/gps.service';
import {Waypoint} from '../../module/core/model/waypoint.model';
import {EMPTY, iif, Observable, of} from 'rxjs';
import {NmeaClientService} from '../../module/core/service/nmea-client.service';
import {NmeaService} from '../../module/core/service/nmea.service';
import {GSAPacket, RMCPacket} from 'nmea-simple';

enum GPSStatus {
  CLOSED = 'closed',
  CONNECTING = 'connecting',
  CONNECTED = 'connected'
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  public currentStatus$: Observable<GPSStatus>;

  public title: string;

  public currentWaypoint$: Observable<Waypoint>;

  public constructor(private router: Router,
                     private activatedRoute: ActivatedRoute,
                     private gpsService: GpsService,
                     private nmeaClient: NmeaClientService) {
    this.router
      .events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }

          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((data: any[]) => this.title = data['title']);
  }

  public ngOnInit(): void {
    this.currentStatus$ = this.nmeaClient.isOpened().pipe(
      mergeMap((isConnected: boolean) => iif(
        () => isConnected,
        this.gpsService.getGPGSA().pipe(
          map((packet: RMCPacket) => packet.status === 'valid' ? GPSStatus.CONNECTED : GPSStatus.CONNECTING)
        ),
        of(GPSStatus.CLOSED)
      ))
    );

    this.currentWaypoint$ = this.gpsService.getCurrentWaypoint();
  }

  public ngOnDestroy(): void {

  }

  public isClose(status: GPSStatus): boolean {
    return status === GPSStatus.CLOSED;
  }

  public isConnecting(status: GPSStatus): boolean {
    return status === GPSStatus.CONNECTING;
  }

  public isConnected(status: GPSStatus): boolean {
    return status === GPSStatus.CONNECTED;
  }

  public cancelCurrentWaypoint(): void {
    this.gpsService.changeCurrentWaypoint(null);
  }
}
