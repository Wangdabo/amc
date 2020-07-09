import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990241Component } from './tx990241.component';

describe('Tx990241Component', () => {
  let component: Tx990241Component;
  let fixture: ComponentFixture<Tx990241Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990241Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990241Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
