import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990510Component } from './tx990510.component';

describe('Tx990510Component', () => {
  let component: Tx990510Component;
  let fixture: ComponentFixture<Tx990510Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990510Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990510Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
