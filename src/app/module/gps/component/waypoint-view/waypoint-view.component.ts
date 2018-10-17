import {Component, OnDestroy, OnInit} from '@angular/core';
import {GpsService} from '../../../core/service/gps.service';
import {RMCPacket} from 'nmea-simple';
import * as formatcoords from 'formatcoords';
import * as leftPad from 'left-pad';
import {filter} from 'rxjs/internal/operators';
import {Router} from '@angular/router';
import {Waypoint} from '../../../core/model/waypoint.model';
import {Subscription} from 'rxjs/index';

@Component({
  selector: 'app-waypoint-view',
  templateUrl: './waypoint-view.component.html',
  styleUrls: ['./waypoint-view.component.scss']
})
export class WaypointViewComponent implements OnInit, OnDestroy {

  public rmcData: RMCPacket;

  public coordAsString: string = null;

  public waypoint: Waypoint = null;

  public distance: string = null;

  public orientation: string = null;

  public remainingTime: string = null;

  private subscription: Subscription;

  public constructor(
    private gpsService: GpsService,
    private router: Router) {
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public ngOnInit(): void {
    this.gpsService.currentWaypoint$.subscribe(
      (waypoint: Waypoint) => {
        this.waypoint = waypoint;
        this.distance = null;
        this.orientation = null;
        this.remainingTime = null;
      },
    );


    this.subscription = this.gpsService.getGPRMC()
      .pipe(
        filter((rmcData: RMCPacket) => rmcData.status === 'valid')
      )
      .subscribe(
        (rmcData: RMCPacket) => {
          this.rmcData = rmcData;

          if (this.rmcData) {
            this.coordAsString = formatcoords(this.rmcData.latitude, this.rmcData.longitude)
              .format(
                'Ff',
                {
                  latLonSeparator: ' <br/> ',
                  decimalPlaces: 3
                }
              )
              .replace(/\d{1,3}[°]/g, (found: string) => leftPad(found, 4, '0'))
              .replace(/\d{1,2}[.]/g, (found: string) => leftPad(found, 3, '0'));

            if (this.waypoint) {
              const d: number = this.distanceInNmBetweenEarthCoordinates(
                this.rmcData.latitude,
                this.rmcData.longitude,
                this.waypoint.lat,
                this.waypoint.lng
              );
              this.distance = d.toFixed(2);

              this.orientation = leftPad(
                this.getBearing(
                  this.rmcData.latitude,
                  this.rmcData.longitude,
                  this.waypoint.lat,
                  this.waypoint.lng
                ).toFixed(1),
                5,
                '0'
              );

              this.remainingTime = this.getRemainingTime(d, this.rmcData.speedKnots);
            }
          } else {
            this.coordAsString = null;
          }
        },
        (err: Error) => {
          console.log(err);
        }
      );
  }

  public onSwipe($event): void {
    if ($event.direction === 4) {
      this.router.navigate(['app', 'gps', 'main']);
    }
  }

  public get trackTrue(): string {
    if (!this.rmcData) {
      return null;
    }

    return leftPad(this.rmcData.trackTrue.toFixed(1), 5, '0');
  }

  private radians(n): number {
    return n * (Math.PI / 180);
  }

  private degrees(n): number {
    return n * (180 / Math.PI);
  }

  private distanceInNmBetweenEarthCoordinates(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadiusKm: number = 6371;

    const dLat: number = this.radians(lat2 - lat1);
    const dLon: number = this.radians(lon2 - lon1);

    lat1 = this.radians(lat1);
    lat2 = this.radians(lat2);

    const a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c * 0.539957;
  }

  private getBearing(startLat: number, startLong: number, endLat: number, endLong: number): number {
    startLat = this.radians(startLat);
    startLong = this.radians(startLong);
    endLat = this.radians(endLat);
    endLong = this.radians(endLong);

    let dLong: number = endLong - startLong;

    const dPhi: number = Math.log(Math.tan(endLat / 2 + Math.PI / 4) / Math.tan(startLat / 2 + Math.PI / 4));
    if (Math.abs(dLong) > Math.PI) {
      if (dLong > 0.0) {
        dLong = -(2.0 * Math.PI - dLong);
      } else {
        dLong = (2.0 * Math.PI + dLong);
      }
    }

    return (this.degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
  }

  private getRemainingTime(distanceToGo: number, speed: number): string {
    const decimalHours: number = distanceToGo / speed;
    const hours = Math.trunc(decimalHours);
    let minutes = Math.trunc(decimalHours * 60);
    minutes = minutes - (hours * 60);

    return leftPad(hours.toString(), 2, '0') + ':' + leftPad(minutes.toString(), 2, '0');
  }
}
