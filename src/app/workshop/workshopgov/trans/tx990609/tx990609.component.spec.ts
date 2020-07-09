import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990609Component } from './tx990609.component';

describe('Tx990609Component', () => {
  let component: Tx990609Component;
  let fixture: ComponentFixture<Tx990609Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990609Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990609Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
