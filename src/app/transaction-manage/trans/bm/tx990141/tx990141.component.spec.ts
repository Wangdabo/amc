import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990141Component } from './tx990141.component';

describe('Tx990141Component', () => {
  let component: Tx990141Component;
  let fixture: ComponentFixture<Tx990141Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990141Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990141Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
