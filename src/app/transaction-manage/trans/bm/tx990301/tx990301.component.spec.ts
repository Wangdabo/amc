import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990301Component } from './tx990301.component';

describe('Tx990301Component', () => {
  let component: Tx990301Component;
  let fixture: ComponentFixture<Tx990301Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990301Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990301Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
