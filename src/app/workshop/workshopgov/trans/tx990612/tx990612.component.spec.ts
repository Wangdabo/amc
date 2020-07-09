import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990612Component } from './tx990612.component';

describe('Tx990612Component', () => {
  let component: Tx990612Component;
  let fixture: ComponentFixture<Tx990612Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990612Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990612Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
