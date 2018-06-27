import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GpsService} from './service/gps.service';
import {UserPreferencesService} from './service/user-preferences.service';
import {WaypointService} from './service/waypoint.service';

@NgModule({
  providers: [
    GpsService,
    UserPreferencesService,
    WaypointService
  ]
})
export class CoreModule { }
