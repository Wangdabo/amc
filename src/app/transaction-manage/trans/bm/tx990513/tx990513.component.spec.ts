import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990513Component } from './tx990513.component';

describe('Tx990513Component', () => {
  let component: Tx990513Component;
  let fixture: ComponentFixture<Tx990513Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990513Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990513Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
