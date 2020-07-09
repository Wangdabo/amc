import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990530Component } from './tx990530.component';

describe('Tx990530Component', () => {
  let component: Tx990530Component;
  let fixture: ComponentFixture<Tx990530Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990530Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990530Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
