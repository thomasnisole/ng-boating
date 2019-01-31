import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {UserPreferencesService} from '../../core/service/user-preferences.service';
import {mergeMap} from 'rxjs/internal/operators';

@Injectable()
export class UserPreferencesGuard implements CanActivate {

  public constructor(private userPreferencesService: UserPreferencesService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userPreferencesService.find().pipe(
      mergeMap(() => of(true))
    );
  }
}
