import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SatellitesViewComponent } from './component/satellites-view/satellites-view.component';
import {GpsRoutingModule} from './gps-routing.module';
import { MainViewComponent } from './component/main-view/main-view.component';

@NgModule({
  imports: [
    CommonModule,
    GpsRoutingModule
  ],
  declarations: [
    SatellitesViewComponent,
    MainViewComponent
  ]
})
export class GpsModule { }
