import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990509Component } from './tx990509.component';

describe('Tx990509Component', () => {
  let component: Tx990509Component;
  let fixture: ComponentFixture<Tx990509Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990509Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990509Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
