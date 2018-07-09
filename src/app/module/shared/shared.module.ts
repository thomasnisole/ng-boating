import {NgModule} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {UserPreferencesService} from '../core/service/user-preferences.service';
import {Ng2FittextModule} from 'ng2-fittext';
import {UserPreferences} from '../core/model/user-preferences.model';

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
export class SharedModule {}
