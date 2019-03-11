import { NgModule } from '@angular/core';
import {SettingsRoutingModule} from './settings-routing.module';
import { SettingsComponent } from './component/settings/settings.component';
import { TrackerComponent } from './component/tracker/tracker.component';
import { GeneralComponent } from './component/general/general.component';
import {SharedModule} from '../shared/shared.module';
import { QuitComponent } from './component/quit/quit.component';

@NgModule({
  imports: [
    SettingsRoutingModule,
    SharedModule
  ],
  declarations: [
    SettingsComponent,
    TrackerComponent,
    GeneralComponent,
    QuitComponent
  ]
})
export class SettingsModule { }
