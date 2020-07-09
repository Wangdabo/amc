import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990503Component } from './tx990503.component';

describe('Tx990503Component', () => {
  let component: Tx990503Component;
  let fixture: ComponentFixture<Tx990503Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990503Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990503Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
