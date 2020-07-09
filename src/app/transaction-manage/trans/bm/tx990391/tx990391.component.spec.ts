import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990391Component } from './tx990391.component';

describe('Tx990391Component', () => {
  let component: Tx990391Component;
  let fixture: ComponentFixture<Tx990391Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990391Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990391Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
