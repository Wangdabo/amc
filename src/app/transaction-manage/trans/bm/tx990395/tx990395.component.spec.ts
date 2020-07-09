import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990395Component } from './tx990395.component';

describe('Tx990395Component', () => {
  let component: Tx990395Component;
  let fixture: ComponentFixture<Tx990395Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990395Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990395Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
