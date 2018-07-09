import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs/index';
import {UserPreferencesService} from '../module/core/service/user-preferences.service';
import {mergeMap} from 'rxjs/internal/operators';
import {UserPreferences} from '../module/core/model/user-preferences.model';

@Injectable()
export class AppGuardService implements CanActivate {

  public constructor(private userPreferencesService: UserPreferencesService) {}

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userPreferencesService.find().pipe(
      mergeMap((userPreferences: UserPreferences) => of(true))
    );
  }
}
