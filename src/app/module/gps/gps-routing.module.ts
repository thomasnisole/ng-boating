import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SatellitesViewComponent} from './component/satellites-view/satellites-view.component';
import {MainViewComponent} from './component/main-view/main-view.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main'
  },
  {
    path: 'main',
    component: MainViewComponent,
    data: {
      title: 'GPS'
    }
  },
  {
    path: 'satellites',
    component: SatellitesViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GpsRoutingModule {}
