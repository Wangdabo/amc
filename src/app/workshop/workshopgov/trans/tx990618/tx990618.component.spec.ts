import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990618Component } from './tx990618.component';

describe('Tx990618Component', () => {
  let component: Tx990618Component;
  let fixture: ComponentFixture<Tx990618Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990618Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990618Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
