import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990606Component } from './tx990606.component';

describe('Tx990606Component', () => {
  let component: Tx990606Component;
  let fixture: ComponentFixture<Tx990606Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990606Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990606Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
