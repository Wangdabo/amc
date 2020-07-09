import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990239Component } from './tx990239.component';

describe('Tx990239Component', () => {
  let component: Tx990239Component;
  let fixture: ComponentFixture<Tx990239Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990239Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990239Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
