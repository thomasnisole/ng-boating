import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatitudeFieldComponent } from './latitude-field.component';

describe('LatitudeFieldComponent', () => {
  let component: LatitudeFieldComponent;
  let fixture: ComponentFixture<LatitudeFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatitudeFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatitudeFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
