import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx991001Component } from './tx991001.component';

describe('Tx991001Component', () => {
  let component: Tx991001Component;
  let fixture: ComponentFixture<Tx991001Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx991001Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx991001Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
