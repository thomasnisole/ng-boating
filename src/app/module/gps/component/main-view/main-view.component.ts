import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GpsService} from '../../../core/service/gps.service';
import {UserPreferencesService} from '../../../core/service/user-preferences.service';
import {mergeMap} from 'rxjs/operators';
import {RMCPacket} from 'nmea-simple';
import * as formatcoords from 'formatcoords';
import * as leftPad from 'left-pad';
import {UserPreferences} from '../../../core/model/user-preferences.model';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  public rmcData: RMCPacket;

  public coordAsString: string = null;

  public constructor(private userPreferencesService: UserPreferencesService, private gpsService: GpsService) {}

  /**
   * @TODO: ATTENTION, IL FAUT FORKER LE FIT TEXT POUR AJOUTER LE DONE = FALSE;
   */
  public ngOnInit(): void {
    this.userPreferencesService.find()
      .pipe(
        mergeMap((preferences: UserPreferences) => this.gpsService.open(preferences.baudRate, preferences.port)
          .pipe(
            mergeMap(() => this.gpsService.getRMCData())
          )
        )
      )
      .subscribe((rmcData: RMCPacket) => {
        this.rmcData = rmcData;

        console.log(this.rmcData);
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
      });
  }
}
