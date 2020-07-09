import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990237Component } from './tx990237.component';

describe('Tx990237Component', () => {
  let component: Tx990237Component;
  let fixture: ComponentFixture<Tx990237Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990237Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990237Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
