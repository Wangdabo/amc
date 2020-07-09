import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990425Component } from './tx990425.component';

describe('Tx990425Component', () => {
  let component: Tx990425Component;
  let fixture: ComponentFixture<Tx990425Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990425Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990425Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
