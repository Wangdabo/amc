import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990502Component } from './tx990502.component';

describe('Tx990502Component', () => {
  let component: Tx990502Component;
  let fixture: ComponentFixture<Tx990502Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990502Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990502Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
