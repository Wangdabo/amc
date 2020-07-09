import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990619Component } from './tx990619.component';

describe('Tx990619Component', () => {
  let component: Tx990619Component;
  let fixture: ComponentFixture<Tx990619Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990619Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990619Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
