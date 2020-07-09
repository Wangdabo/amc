import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990505Component } from './tx990505.component';

describe('Tx990505Component', () => {
  let component: Tx990505Component;
  let fixture: ComponentFixture<Tx990505Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990505Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990505Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
