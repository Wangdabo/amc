import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990617Component } from './tx990617.component';

describe('Tx990617Component', () => {
  let component: Tx990617Component;
  let fixture: ComponentFixture<Tx990617Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990617Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990617Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
