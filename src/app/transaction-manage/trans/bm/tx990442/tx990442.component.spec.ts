import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990442Component } from './tx990442.component';

describe('Tx990442Component', () => {
  let component: Tx990442Component;
  let fixture: ComponentFixture<Tx990442Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990442Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990442Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
