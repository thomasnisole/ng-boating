import { TestBed, inject } from '@angular/core/testing';

import { UserPreferencesGuard } from './user-preferences.guard';

describe('UserPreferencesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserPreferencesGuard]
    });
  });

  it('should be created', inject([UserPreferencesGuard], (service: UserPreferencesGuard) => {
    expect(service).toBeTruthy();
  }));
});
