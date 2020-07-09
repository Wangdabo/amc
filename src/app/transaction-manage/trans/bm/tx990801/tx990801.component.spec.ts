import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990801Component } from './tx990801.component';

describe('Tx990801Component', () => {
  let component: Tx990801Component;
  let fixture: ComponentFixture<Tx990801Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990801Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990801Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
