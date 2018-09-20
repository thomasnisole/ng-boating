import { Injectable } from '@angular/core';
import {UserPreferences} from '../model/user-preferences.model';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {catchError, map, mergeMap, share, tap} from 'rxjs/internal/operators';
import {EMPTY, Observable, of} from 'rxjs/index';

@Injectable()
export class UserPreferencesService {

  private userPreferences: UserPreferences;

  public constructor(private http: HttpClient) {}

  public find(): Observable<UserPreferences> {
    if (this.userPreferences) {
      return of(this.userPreferences);
    }

    return this.http
      .get(environment.backendUrl + 'user-preferences')
      .pipe(
        map((response: HttpResponse<UserPreferences>) => response),
        catchError((err: HttpErrorResponse, caught: Observable<UserPreferences>) => {
          if (err.status === 404) {
            return this.update(environment.defaultUserPreferences).pipe(
              mergeMap(() => caught)
            );
          }

          return EMPTY;
        }),
        tap((userPreferences: UserPreferences) => this.userPreferences = userPreferences)
      );
  }

  public update(userPreferences: UserPreferences): Observable<any> {
    return this.http.post('http://localhost:80/user-preferences', userPreferences).pipe(
      tap(() => this.userPreferences = null)
    );
  }
}
