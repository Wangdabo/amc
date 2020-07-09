import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990511Component } from './tx990511.component';

describe('Tx990511Component', () => {
  let component: Tx990511Component;
  let fixture: ComponentFixture<Tx990511Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990511Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990511Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
