import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GpsService} from './service/gps.service';
import {UserPreferencesService} from './service/user-preferences.service';
import {WaypointService} from './service/waypoint.service';
import {UserPreferences} from './model/user-preferences.model';
import {TranslateService} from '@ngx-translate/core';
import {NmeaService} from './service/nmea.service';

@NgModule({
  providers: [
    GpsService,
    NmeaService,
    UserPreferencesService,
    WaypointService
  ]
})
export class CoreModule {

  public constructor(translate: TranslateService, userPreferencesService: UserPreferencesService) {
    userPreferencesService.find().subscribe(
      (userPreferences: UserPreferences) => {
        translate.setDefaultLang(userPreferences.language);
        translate.use(userPreferences.language);
      }
    );
  }
}
