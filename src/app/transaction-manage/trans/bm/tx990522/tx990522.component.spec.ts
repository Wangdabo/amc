import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990522Component } from './tx990522.component';

describe('Tx990522Component', () => {
  let component: Tx990522Component;
  let fixture: ComponentFixture<Tx990522Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990522Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990522Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
