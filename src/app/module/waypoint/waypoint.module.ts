import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaypointsComponent } from './component/waypoints/waypoints.component';
import { WaypointComponent } from './component/waypoint/waypoint.component';
import {WaypointRoutingModule} from './waypoint-routing.module';
import {SharedModule} from '../shared/shared.module';
import { WaypointsFilterPipe } from './pipe/waypoints-filter.pipe';
import {WaypointResolver} from './resolver/waypoint-resolver.service';

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
  ],
  providers: [
    WaypointResolver
  ]
})
export class WaypointModule { }
