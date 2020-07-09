import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990527Component } from './tx990527.component';

describe('Tx990527Component', () => {
  let component: Tx990527Component;
  let fixture: ComponentFixture<Tx990527Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990527Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990527Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
