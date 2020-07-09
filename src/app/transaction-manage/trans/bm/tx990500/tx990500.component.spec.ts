import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990500Component } from './tx990500.component';

describe('Tx990500Component', () => {
  let component: Tx990500Component;
  let fixture: ComponentFixture<Tx990500Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990500Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
