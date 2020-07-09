import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990433Component } from './tx990433.component';

describe('Tx990433Component', () => {
  let component: Tx990433Component;
  let fixture: ComponentFixture<Tx990433Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990433Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990433Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
