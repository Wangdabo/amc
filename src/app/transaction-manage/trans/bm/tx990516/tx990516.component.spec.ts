import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990516Component } from './tx990516.component';

describe('Tx990516Component', () => {
  let component: Tx990516Component;
  let fixture: ComponentFixture<Tx990516Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990516Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990516Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
