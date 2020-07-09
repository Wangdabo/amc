import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990613Component } from './tx990613.component';

describe('Tx990613Component', () => {
  let component: Tx990613Component;
  let fixture: ComponentFixture<Tx990613Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990613Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990613Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
