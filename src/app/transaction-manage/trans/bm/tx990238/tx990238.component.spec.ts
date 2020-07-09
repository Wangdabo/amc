import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990238Component } from './tx990238.component';

describe('Tx990238Component', () => {
  let component: Tx990238Component;
  let fixture: ComponentFixture<Tx990238Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990238Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990238Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
