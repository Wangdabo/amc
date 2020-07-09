import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990515Component } from './tx990515.component';

describe('Tx990515Component', () => {
  let component: Tx990515Component;
  let fixture: ComponentFixture<Tx990515Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990515Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990515Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
