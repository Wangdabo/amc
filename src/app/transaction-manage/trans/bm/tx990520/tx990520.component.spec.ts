import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990520Component } from './tx990520.component';

describe('Tx990520Component', () => {
  let component: Tx990520Component;
  let fixture: ComponentFixture<Tx990520Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990520Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990520Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
