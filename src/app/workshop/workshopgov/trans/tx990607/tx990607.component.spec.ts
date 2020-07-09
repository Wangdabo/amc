import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990607Component } from './tx990607.component';

describe('Tx990607Component', () => {
  let component: Tx990607Component;
  let fixture: ComponentFixture<Tx990607Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990607Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990607Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
