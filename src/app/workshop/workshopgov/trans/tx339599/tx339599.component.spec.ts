import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx339599Component } from './tx339599.component';

describe('Tx339599Component', () => {
  let component: Tx339599Component;
  let fixture: ComponentFixture<Tx339599Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx339599Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx339599Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
