import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990235Component } from './tx990235.component';

describe('Tx990235Component', () => {
  let component: Tx990235Component;
  let fixture: ComponentFixture<Tx990235Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990235Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990235Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
