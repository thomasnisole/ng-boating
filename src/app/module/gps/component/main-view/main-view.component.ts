import {Component, OnDestroy, OnInit} from '@angular/core';
import {GpsService} from '../../../core/service/gps.service';
import {UserPreferencesService} from '../../../core/service/user-preferences.service';
import {mergeMap} from 'rxjs/operators';
import {RMCPacket} from 'nmea-simple';
import * as formatcoords from 'formatcoords';
import * as leftPad from 'left-pad';
import {UserPreferences} from '../../../core/model/user-preferences.model';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/index';
import {filter} from 'rxjs/internal/operators';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit, OnDestroy {

  public rmcData: RMCPacket;

  public coordAsString: string = null;

  public subscription: Subscription;

  public constructor(private userPreferencesService: UserPreferencesService, private gpsService: GpsService, private router: Router) {
  }

  public ngOnInit(): void {
    this.subscription = this.userPreferencesService.find()
      .pipe(
        mergeMap((preferences: UserPreferences) => this.gpsService.open(preferences.baudRate, preferences.port)
          .pipe(
            mergeMap(() => this.gpsService.getRMCData())
          )
        ),
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
          } else {
            this.coordAsString = null;
          }
        },
        (err: Error) => {
          console.log(err);
        }
      );
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public onSwipe($event): void {
    switch ($event.direction) {
      case 2:
        this.router.navigate(['app', 'gps', 'waypoint']);
        break;

      case 4:
        this.router.navigate(['app', 'gps', 'satellites']);
        break;
    }
  }
}

