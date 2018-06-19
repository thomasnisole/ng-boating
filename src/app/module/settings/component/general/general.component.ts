import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UserPreferencesService} from '../../../core/service/user-preferences.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  public currentLanguage: string = '';

  public constructor(
    private translateService: TranslateService,
    private userPreferencesService: UserPreferencesService) {
    this.currentLanguage = this.translateService.currentLang;
  }

  public ngOnInit(): void {}

  public onLanguageChange(): void {
    this.translateService.use(this.currentLanguage);
    this.userPreferencesService.preferences.language = this.currentLanguage;
    this.userPreferencesService.save();
  }
}
