import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SatellitesViewComponent } from './satellites-view.component';

describe('SatellitesViewComponent', () => {
  let component: SatellitesViewComponent;
  let fixture: ComponentFixture<SatellitesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SatellitesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SatellitesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
