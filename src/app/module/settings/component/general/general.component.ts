import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {UserPreferencesService} from '../../../core/service/user-preferences.service';
import {UserPreferences} from '../../../core/model/user-preferences.model';
import {tap} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  public userPreferences: UserPreferences = null;

  public userPreferences$: Observable<UserPreferences>;

  public constructor(
    private translateService: TranslateService,
    private userPreferencesService: UserPreferencesService) {}

  public ngOnInit(): void {
    this.userPreferences$ = this.userPreferencesService.find().pipe(tap(
      (userPreferences: UserPreferences) => this.userPreferences = userPreferences
    ));
  }

  public onLanguageChange(): void {
    this.userPreferencesService.update(this.userPreferences);
    this.translateService.use(this.userPreferences.language);
  }
}
