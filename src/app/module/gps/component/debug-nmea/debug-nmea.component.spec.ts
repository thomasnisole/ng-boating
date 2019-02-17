import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugNmeaComponent } from './debug-nmea.component';

describe('DebugNmeaComponent', () => {
  let component: DebugNmeaComponent;
  let fixture: ComponentFixture<DebugNmeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DebugNmeaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugNmeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
