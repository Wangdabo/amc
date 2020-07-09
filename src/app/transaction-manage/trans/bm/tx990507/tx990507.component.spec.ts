import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990507Component } from './tx990507.component';

describe('Tx990507Component', () => {
  let component: Tx990507Component;
  let fixture: ComponentFixture<Tx990507Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Tx990507Component]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990507Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
