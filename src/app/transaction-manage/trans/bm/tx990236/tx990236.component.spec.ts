import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990236Component } from './tx990236.component';

describe('Tx990236Component', () => {
  let component: Tx990236Component;
  let fixture: ComponentFixture<Tx990236Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Tx990236Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990236Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
