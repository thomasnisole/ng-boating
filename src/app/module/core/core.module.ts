import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GpsService} from './service/gps.service';
import {UserPreferencesService} from './service/user-preferences.service';

@NgModule({
  providers: [
    GpsService,
    UserPreferencesService
  ]
})
export class CoreModule { }
