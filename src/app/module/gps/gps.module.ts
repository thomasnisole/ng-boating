import { NgModule } from '@angular/core';
import { SatellitesViewComponent } from './component/satellites-view/satellites-view.component';
import {GpsRoutingModule} from './gps-routing.module';
import { MainViewComponent } from './component/main-view/main-view.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    GpsRoutingModule,
    SharedModule
  ],
  declarations: [
    SatellitesViewComponent,
    MainViewComponent
  ]
})
export class GpsModule { }
