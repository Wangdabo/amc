import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990409Component } from './tx990409.component';

describe('Tx990409Component', () => {
  let component: Tx990409Component;
  let fixture: ComponentFixture<Tx990409Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990409Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990409Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
