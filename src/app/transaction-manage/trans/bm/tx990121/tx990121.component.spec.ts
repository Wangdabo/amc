import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990121Component } from './tx990121.component';

describe('Tx990121Component', () => {
  let component: Tx990121Component;
  let fixture: ComponentFixture<Tx990121Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990121Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990121Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
