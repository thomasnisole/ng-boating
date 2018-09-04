import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaypointsComponent } from './component/waypoints/waypoints.component';
import { WaypointComponent } from './component/waypoint/waypoint.component';
import {WaypointRoutingModule} from './waypoint-routing.module';
import {SharedModule} from '../shared/shared.module';
import { WaypointsFilterPipe } from './pipe/waypoints-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WaypointRoutingModule
  ],
  declarations: [
    WaypointsComponent,
    WaypointComponent,
    WaypointsFilterPipe
  ]
})
export class WaypointModule { }
