import {NgModule} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {UserPreferencesService} from '../core/service/user-preferences.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule
  ]
})
export class SharedModule {

  public constructor(translate: TranslateService, userPreferencesService: UserPreferencesService) {
    translate.setDefaultLang(userPreferencesService.preferences.language);
    translate.use(userPreferencesService.preferences.language);
  }
}
