import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990381Component } from './tx990381.component';

describe('Tx990381Component', () => {
  let component: Tx990381Component;
  let fixture: ComponentFixture<Tx990381Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990381Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990381Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
