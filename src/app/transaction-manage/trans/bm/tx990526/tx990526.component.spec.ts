import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990526Component } from './tx990526.component';

describe('Tx990526Component', () => {
  let component: Tx990526Component;
  let fixture: ComponentFixture<Tx990526Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990526Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990526Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
