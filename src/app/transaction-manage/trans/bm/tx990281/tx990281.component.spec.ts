import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990281Component } from './tx990281.component';

describe('Tx990281Component', () => {
  let component: Tx990281Component;
  let fixture: ComponentFixture<Tx990281Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990281Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990281Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
