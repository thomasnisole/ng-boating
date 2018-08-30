import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {WaypointsComponent} from './component/waypoints/waypoints.component';
import {WaypointComponent} from './component/waypoint/waypoint.component';
import {WaypointResolver} from './resolver/waypoint-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: WaypointsComponent,
    data: {
      title: 'menu.waypoints'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'add'
      },
      {
        path: 'add',
        component: WaypointComponent,
        data: {
          title: 'menu.waypoints'
        }
      },
      {
        path: ':waypoint_id',
        resolve: {
          waypoint: WaypointResolver
        },
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
