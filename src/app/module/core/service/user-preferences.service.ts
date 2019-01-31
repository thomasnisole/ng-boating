import {Injectable} from '@angular/core';
import {UserPreferences} from '../model/user-preferences.model';
import {environment} from '../../../../environments/environment';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {NgxTsDeserializerService, NgxTsSerializerService} from 'ngx-ts-serializer';
import {ElectronService} from '../../system/service/electron.service';
import {filter} from 'rxjs/operators';

@Injectable()
export class UserPreferencesService {

  private userPreferencesSubject: BehaviorSubject<UserPreferences>;

  private filePath: string = '';

  private readonly userPreferencesFileName: string = 'user-preferences.json';

  public constructor(private deserializer: NgxTsDeserializerService,
                     private serializer: NgxTsSerializerService,
                     private electronService: ElectronService) {
    this.filePath = this.electronService.os.homedir() + '/.ng-boating';
    this.userPreferencesSubject = new BehaviorSubject(null);

    if (!this.electronService.fs.existsSync(this.filePath + '/' + this.userPreferencesFileName)) {
      this.update(this.deserializer.deserialize(UserPreferences, environment.defaultUserPreferences));
    } else {
      this.userPreferencesSubject.next(this.deserializer.deserialize(UserPreferences, JSON.parse(
        this.electronService.fs.readFileSync(this.filePath + '/' + this.userPreferencesFileName, 'utf8')
      )));
    }
  }

  public find(): Observable<UserPreferences> {
    return this.userPreferencesSubject.pipe(
      filter((up: UserPreferences) => !!up)
    );
  }

  public update(userPreferences: UserPreferences): void {
    if (!this.electronService.fs.existsSync(this.filePath)) {
      this.electronService.fs.mkdirSync(this.filePath);
    }

    this.electronService.fs.writeFileSync(
      this.filePath + '/' + this.userPreferencesFileName,
      JSON.stringify(this.serializer.serialize(userPreferences))
    );
    this.userPreferencesSubject.next(userPreferences);
  }
}
