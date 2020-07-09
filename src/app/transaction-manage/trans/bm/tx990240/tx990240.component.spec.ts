import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990240Component } from './tx990240.component';

describe('Tx990240Component', () => {
  let component: Tx990240Component;
  let fixture: ComponentFixture<Tx990240Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990240Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990240Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
