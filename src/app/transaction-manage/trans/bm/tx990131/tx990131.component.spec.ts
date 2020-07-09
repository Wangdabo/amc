import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990131Component } from './tx990131.component';

describe('Tx990131Component', () => {
  let component: Tx990131Component;
  let fixture: ComponentFixture<Tx990131Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990131Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990131Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
