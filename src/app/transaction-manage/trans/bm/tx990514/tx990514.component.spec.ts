import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990514Component } from './tx990514.component';

describe('Tx990514Component', () => {
  let component: Tx990514Component;
  let fixture: ComponentFixture<Tx990514Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990514Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990514Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
