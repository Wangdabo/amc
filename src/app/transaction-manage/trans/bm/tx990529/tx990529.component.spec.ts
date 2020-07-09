import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990529Component } from './tx990529.component';

describe('Tx990529Component', () => {
  let component: Tx990529Component;
  let fixture: ComponentFixture<Tx990529Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990529Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990529Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
