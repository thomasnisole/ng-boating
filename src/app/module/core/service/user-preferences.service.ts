import { Injectable } from '@angular/core';
import {UserPreferences} from '../model/user-preferences.model';
import {environment} from '../../../../environments/environment';

const remote = (<any>window).require('electron').remote;
export const os = remote.require('os');
export const fs = remote.require('fs');

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {

  public filePath: string = os.homedir() + '/.ng-boating';

  private fileName: string = 'user-preferences.json';

  public preferences: UserPreferences;

  public constructor() {
    if (fs.existsSync(this.filePath + '/' + this.fileName)) {
      this.preferences = <UserPreferences>JSON.parse(fs.readFileSync(this.filePath + '/' + this.fileName));
    } else {
      this.preferences = environment.defaultUserPreferences;
      this.save();
    }
  }

  public save(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.mkdir(this.filePath);
    }

    fs.writeFileSync(this.filePath + '/' + this.fileName, JSON.stringify(this.preferences));
  }
}
