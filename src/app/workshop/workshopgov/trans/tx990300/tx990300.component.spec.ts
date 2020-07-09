import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990300Component } from './tx990300.component';

describe('Tx990300Component', () => {
  let component: Tx990300Component;
  let fixture: ComponentFixture<Tx990300Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990300Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990300Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
