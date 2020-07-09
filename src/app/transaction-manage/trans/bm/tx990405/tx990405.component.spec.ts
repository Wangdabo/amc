import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990405Component } from './tx990405.component';

describe('Tx990405Component', () => {
  let component: Tx990405Component;
  let fixture: ComponentFixture<Tx990405Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990405Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990405Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
