import {NgModule} from '@angular/core';
import {GpsService} from './service/gps.service';
import {UserPreferencesService} from './service/user-preferences.service';
import {WaypointService} from './service/waypoint.service';
import {UserPreferences} from './model/user-preferences.model';
import {TranslateService} from '@ngx-translate/core';
import {NmeaClientService} from './service/nmea-client.service';
import {distinctUntilChanged, filter, mergeMap} from 'rxjs/internal/operators';

@NgModule({
  providers: [
    GpsService,
    NmeaClientService,
    UserPreferencesService,
    WaypointService
  ]
})
export class CoreModule {

  public constructor(translate: TranslateService,
                     userPreferencesService: UserPreferencesService,
                     nmeaClientService: NmeaClientService) {
    nmeaClientService.onError().subscribe(
      (err: string) => console.log(err)
    );

    userPreferencesService.find().pipe(
      distinctUntilChanged((a: UserPreferences, b: UserPreferences) => (a.port !== b.port) || (a.baudRate !== b.baudRate)),
      filter((up: UserPreferences) => !!up.port && !!up.baudRate),
      mergeMap((up: UserPreferences) => nmeaClientService.open(up.baudRate, up.port))
    ).subscribe();

    userPreferencesService.find().subscribe(
      (userPreferences: UserPreferences) => {
        translate.setDefaultLang(userPreferences.language);
        translate.use(userPreferences.language);
      }
    );
  }
}
