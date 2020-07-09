import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990525Component } from './tx990525.component';

describe('Tx990525Component', () => {
  let component: Tx990525Component;
  let fixture: ComponentFixture<Tx990525Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990525Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990525Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
