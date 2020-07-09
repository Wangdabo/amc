import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990523Component } from './tx990523.component';

describe('Tx990523Component', () => {
  let component: Tx990523Component;
  let fixture: ComponentFixture<Tx990523Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990523Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990523Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
