import { NgModule } from '@angular/core';
import { SatellitesViewComponent } from './component/satellites-view/satellites-view.component';
import {GpsRoutingModule} from './gps-routing.module';
import { MainViewComponent } from './component/main-view/main-view.component';
import {SharedModule} from '../shared/shared.module';
import { DialComponent } from './component/dial/dial.component';
import { WaypointViewComponent } from './component/waypoint-view/waypoint-view.component';
import { DebugNmeaComponent } from './component/debug-nmea/debug-nmea.component';

@NgModule({
  imports: [
    GpsRoutingModule,
    SharedModule
  ],
  declarations: [
    SatellitesViewComponent,
    MainViewComponent,
    DialComponent,
    WaypointViewComponent,
    DebugNmeaComponent
  ]
})
export class GpsModule { }
