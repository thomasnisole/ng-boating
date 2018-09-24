import {NgModule} from '@angular/core';
import {GpsService} from './service/gps.service';
import {UserPreferencesService} from './service/user-preferences.service';
import {WaypointService} from './service/waypoint.service';
import {UserPreferences} from './model/user-preferences.model';
import {TranslateService} from '@ngx-translate/core';
import {NmeaService} from './service/nmea.service';
import {NmeaServerService} from './service/nmea-server.service';
import {debounceTime, distinctUntilChanged, filter, mergeMap, retry, tap} from 'rxjs/internal/operators';

@NgModule({
  providers: [
    GpsService,
    NmeaServerService,
    NmeaService,
    UserPreferencesService,
    WaypointService
  ]
})
export class CoreModule {

  public constructor(translate: TranslateService,
                     userPreferencesService: UserPreferencesService,
                     nmeaServerService: NmeaServerService) {
    nmeaServerService.error$.subscribe(
      (err: string) => console.log(err)
    );

    nmeaServerService.open$.pipe(
      tap((t) => console.log(t)),
      filter((connected: boolean) => !connected),
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
