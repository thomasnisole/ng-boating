import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserPreferencesGuard} from './guard/user-preferences.guard';
import {ElectronService} from './service/electron.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    UserPreferencesGuard,
    ElectronService
  ]
})
export class SystemModule {
}
