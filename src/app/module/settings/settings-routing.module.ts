import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SettingsComponent} from './component/settings/settings.component';
import {TrackerComponent} from './component/tracker/tracker.component';
import {GeneralComponent} from './component/general/general.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    data: {
      title: 'menu.settings'
    },
    children: [
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full'
      },
      {
        path: 'general',
        component: GeneralComponent,
        data: {
          title: 'menu.settings'
        }
      },
      {
        path: 'tracker',
        component: TrackerComponent,
        data: {
          title: 'menu.settings'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
