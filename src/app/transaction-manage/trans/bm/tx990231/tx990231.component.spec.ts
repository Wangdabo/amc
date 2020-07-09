import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990231Component } from './tx990231.component';

describe('Tx990231Component', () => {
  let component: Tx990231Component;
  let fixture: ComponentFixture<Tx990231Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990231Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990231Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
