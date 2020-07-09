import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990437Component } from './tx990437.component';

describe('Tx990437Component', () => {
  let component: Tx990437Component;
  let fixture: ComponentFixture<Tx990437Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990437Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990437Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
