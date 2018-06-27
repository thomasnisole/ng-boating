import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {WaypointsComponent} from './component/waypoints/waypoints.component';
import {WaypointComponent} from './component/waypoint/waypoint.component';

const routes: Routes = [
  {
    path: '',
    component: WaypointsComponent,
    data: {
      title: 'menu.waypoints'
    },
    children: [
      {
        path: ':waypoint_id',
        component: WaypointComponent,
        data: {
          title: 'menu.waypoints'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WaypointRoutingModule {}
