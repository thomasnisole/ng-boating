import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MenuComponent} from './component/menu/menu.component';
import {LayoutComponent} from './component/layout/layout.component';
import {UserPreferencesGuard} from './module/system/guard/user-preferences.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [
      UserPreferencesGuard
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'menu'
      },
      {
        path: 'menu',
        component: MenuComponent
      },
      {
        path: 'app',
        component: LayoutComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'gps'
          },
          {
            path: 'gps',
            loadChildren: './module/gps/gps.module#GpsModule'
          },
          {
            path: 'waypoints',
            loadChildren: './module/waypoint/waypoint.module#WaypointModule'
          },
          {
            path: 'settings',
            loadChildren: './module/settings/settings.module#SettingsModule'
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
