import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990341Component } from './tx990341.component';

describe('Tx990341Component', () => {
  let component: Tx990341Component;
  let fixture: ComponentFixture<Tx990341Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990341Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990341Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
