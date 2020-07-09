import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990504Component } from './tx990504.component';

describe('Tx990504Component', () => {
  let component: Tx990504Component;
  let fixture: ComponentFixture<Tx990504Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990504Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990504Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
