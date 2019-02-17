import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SatellitesViewComponent} from './component/satellites-view/satellites-view.component';
import {MainViewComponent} from './component/main-view/main-view.component';
import {WaypointViewComponent} from './component/waypoint-view/waypoint-view.component';
import {DebugNmeaComponent} from './component/debug-nmea/debug-nmea.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'satellites'
  },
  {
    path: 'satellites',
    component: SatellitesViewComponent,
    data: {
      title: 'Satellites'
    }
  },
  {
    path: 'main',
    component: MainViewComponent,
    data: {
      title: 'GPS'
    }
  },
  {
    path: 'waypoint',
    component: WaypointViewComponent,
    data: {
      title: 'GPS'
    }
  },
  {
    path: 'debug',
    component: DebugNmeaComponent,
    data: {
      title: 'Debug'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GpsRoutingModule {}
