import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990528Component } from './tx990528.component';

describe('Tx990528Component', () => {
  let component: Tx990528Component;
  let fixture: ComponentFixture<Tx990528Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990528Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990528Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
