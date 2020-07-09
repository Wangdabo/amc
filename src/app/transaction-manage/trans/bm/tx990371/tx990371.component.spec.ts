import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990371Component } from './tx990371.component';

describe('Tx990371Component', () => {
  let component: Tx990371Component;
  let fixture: ComponentFixture<Tx990371Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990371Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990371Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
