import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990417Component } from './tx990417.component';

describe('Tx990417Component', () => {
  let component: Tx990417Component;
  let fixture: ComponentFixture<Tx990417Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990417Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990417Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
