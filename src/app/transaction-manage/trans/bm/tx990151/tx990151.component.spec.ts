import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990151Component } from './tx990151.component';

describe('Tx990151Component', () => {
  let component: Tx990151Component;
  let fixture: ComponentFixture<Tx990151Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990151Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990151Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
