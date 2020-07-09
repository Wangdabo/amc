import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990145Component } from './tx990145.component';

describe('Tx990145Component', () => {
  let component: Tx990145Component;
  let fixture: ComponentFixture<Tx990145Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990145Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990145Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
