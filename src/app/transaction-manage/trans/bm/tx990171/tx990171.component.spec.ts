import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990171Component } from './tx990171.component';

describe('Tx990171Component', () => {
  let component: Tx990171Component;
  let fixture: ComponentFixture<Tx990171Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990171Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990171Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
