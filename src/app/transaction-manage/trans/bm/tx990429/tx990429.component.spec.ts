import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990429Component } from './tx990429.component';

describe('Tx990429Component', () => {
  let component: Tx990429Component;
  let fixture: ComponentFixture<Tx990429Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990429Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990429Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
