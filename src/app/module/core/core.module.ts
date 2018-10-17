import {NgModule} from '@angular/core';
import {GpsService} from './service/gps.service';
import {UserPreferencesService} from './service/user-preferences.service';
import {WaypointService} from './service/waypoint.service';
import {UserPreferences} from './model/user-preferences.model';
import {TranslateService} from '@ngx-translate/core';
import {NmeaClientService} from './service/nmea-client.service';
import {debounceTime, filter, mergeMap} from 'rxjs/internal/operators';

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
                     nmeaServerService: NmeaClientService) {
    nmeaServerService.error$.subscribe(
      (err: string) => console.log(err)
    );

    nmeaServerService.open$.pipe(
      filter((opened: boolean) => !opened),
      debounceTime(2000),
      mergeMap(() => userPreferencesService.find().pipe(
        mergeMap((up: UserPreferences) => nmeaServerService.open(up.baudRate, up.port))
      ))
    ).subscribe();

    userPreferencesService.find().subscribe(
      (userPreferences: UserPreferences) => {
        translate.setDefaultLang(userPreferences.language);
        translate.use(userPreferences.language);
      }
    );
  }
}
