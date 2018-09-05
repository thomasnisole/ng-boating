import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaypointViewComponent } from './waypoint-view.component';

describe('WaypointViewComponent', () => {
  let component: WaypointViewComponent;
  let fixture: ComponentFixture<WaypointViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaypointViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaypointViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
