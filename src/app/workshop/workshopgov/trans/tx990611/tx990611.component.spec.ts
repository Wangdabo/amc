import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990611Component } from './tx990611.component';

describe('Tx990611Component', () => {
  let component: Tx990611Component;
  let fixture: ComponentFixture<Tx990611Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990611Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990611Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
