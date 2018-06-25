import {NgModule} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {UserPreferencesService} from '../core/service/user-preferences.service';
import {Ng2FittextModule} from 'ng2-fittext';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    Ng2FittextModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule,
    Ng2FittextModule
  ]
})
export class SharedModule {

  public constructor(translate: TranslateService, userPreferencesService: UserPreferencesService) {
    translate.setDefaultLang(userPreferencesService.preferences.language);
    translate.use(userPreferencesService.preferences.language);
  }
}
