import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990616Component } from './tx990616.component';

describe('Tx990616Component', () => {
  let component: Tx990616Component;
  let fixture: ComponentFixture<Tx990616Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990616Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990616Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
