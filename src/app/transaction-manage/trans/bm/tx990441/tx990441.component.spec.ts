import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990441Component } from './tx990441.component';

describe('Tx990441Component', () => {
  let component: Tx990441Component;
  let fixture: ComponentFixture<Tx990441Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990441Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990441Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
