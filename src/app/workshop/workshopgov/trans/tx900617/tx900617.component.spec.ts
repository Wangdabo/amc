import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx900617Component } from './tx900617.component';

describe('Tx900617Component', () => {
  let component: Tx900617Component;
  let fixture: ComponentFixture<Tx900617Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx900617Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx900617Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
