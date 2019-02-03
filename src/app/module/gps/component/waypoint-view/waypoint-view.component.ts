import {Component, OnInit} from '@angular/core';
import {GpsService} from '../../../core/service/gps.service';
import {RMCPacket} from 'nmea-simple';
import * as formatcoords from 'formatcoords';
import * as leftPad from 'left-pad';
import {filter, map} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {Waypoint} from '../../../core/model/waypoint.model';
import {combineLatest, Observable} from 'rxjs';
import {GpsUtil} from '../../../system/gps-util';

@Component({
  selector: 'app-waypoint-view',
  templateUrl: './waypoint-view.component.html',
  styleUrls: ['./waypoint-view.component.scss']
})
export class WaypointViewComponent implements OnInit {

  public coordAsString$: Observable<string>;

  public trackTrue$: Observable<string>;

  public speed$: Observable<string>;

  public distance$: Observable<string>;

  public remainingTime$: Observable<string>;

  public orientation$: Observable<string>;

  public waypoint$: Observable<Waypoint> = null;

  public constructor(private gpsService: GpsService, private router: Router) {
  }

  public ngOnInit(): void {
    const rmcData$: Observable<RMCPacket> = this.gpsService.getGPRMC().pipe(
      filter((rmcData: RMCPacket) => !!rmcData && rmcData.status === 'valid')
    );

    this.waypoint$ = this.gpsService.getCurrentWaypoint().pipe(
      filter((waypoint: Waypoint) => !!waypoint),
    );

    this.coordAsString$ = rmcData$.pipe(
      map((rmcPacket: RMCPacket) => formatcoords(rmcPacket.latitude, rmcPacket.longitude)
        .format(
          'Ff',
          {
            latLonSeparator: ' <br/> ',
            decimalPlaces: 3
          }
        )
        .replace(/\d{1,3}[°]/g, (found: string) => leftPad(found, 4, '0'))
        .replace(/\d{1,2}[.]/g, (found: string) => leftPad(found, 3, '0'))
      )
    );

    this.trackTrue$ = rmcData$.pipe(
      map((rmcPacket: RMCPacket) => leftPad(rmcPacket.trackTrue.toFixed(1), 5, '0') + '°')
    );

    this.speed$ = rmcData$.pipe(
      map((rmcPacket: RMCPacket) => rmcPacket.speedKnots.toString())
    );

    this.distance$ = combineLatest(rmcData$, this.waypoint$).pipe(
      map(([rmcPacket, waypoint]: [RMCPacket, Waypoint]) => GpsUtil.distanceInNmBetweenEarthCoordinates(
          rmcPacket.latitude,
          rmcPacket.longitude,
          waypoint.lat,
          waypoint.lng
        ).toFixed(2)
      )
    );

    this.remainingTime$ = combineLatest(rmcData$, this.waypoint$).pipe(
      map(([rmcPacket, waypoint]: [RMCPacket, Waypoint]) => {
        const d: number = GpsUtil.distanceInNmBetweenEarthCoordinates(
          rmcPacket.latitude,
          rmcPacket.longitude,
          waypoint.lat,
          waypoint.lng
        );

        const decimalHours: number = d / rmcPacket.speedKnots;
        const hours = Math.trunc(decimalHours);
        let minutes = Math.trunc(decimalHours * 60);
        minutes = minutes - (hours * 60);

        return leftPad(hours.toString(), 2, '0') + ':' + leftPad(minutes.toString(), 2, '0');
      }
    )
  );

    this.orientation$ = combineLatest(rmcData$, this.waypoint$).pipe(
      map(([rmcPacket, waypoint]: [RMCPacket, Waypoint]) => leftPad(
        GpsUtil.getBearing(
            rmcPacket.latitude,
            rmcPacket.longitude,
            waypoint.lat,
            waypoint.lng
          ).toFixed(1),
          5,
          '0'
        ) + '°'
      )
    );
  }

  public onClick(): void {
    this.router.navigate(['app', 'gps', 'satellites']);
  }
}
