import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990161Component } from './tx990161.component';

describe('Tx990161Component', () => {
  let component: Tx990161Component;
  let fixture: ComponentFixture<Tx990161Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990161Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990161Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
