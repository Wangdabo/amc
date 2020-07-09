import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990615Component } from './tx990615.component';

describe('Tx990615Component', () => {
  let component: Tx990615Component;
  let fixture: ComponentFixture<Tx990615Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990615Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990615Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
