import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990512Component } from './tx990512.component';

describe('Tx990512Component', () => {
  let component: Tx990512Component;
  let fixture: ComponentFixture<Tx990512Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990512Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990512Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
