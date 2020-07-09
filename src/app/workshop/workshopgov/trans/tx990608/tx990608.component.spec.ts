import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990608Component } from './tx990608.component';

describe('Tx990608Component', () => {
  let component: Tx990608Component;
  let fixture: ComponentFixture<Tx990608Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990608Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990608Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
