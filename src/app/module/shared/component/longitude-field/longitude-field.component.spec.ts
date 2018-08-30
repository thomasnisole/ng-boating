import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongitudeFieldComponent } from './longitude-field.component';

describe('LongitudeFieldComponent', () => {
  let component: LongitudeFieldComponent;
  let fixture: ComponentFixture<LongitudeFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LongitudeFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongitudeFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
