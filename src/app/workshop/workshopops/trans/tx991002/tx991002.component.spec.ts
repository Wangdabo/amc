import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx991002Component } from './tx991002.component';

describe('Tx991002Component', () => {
  let component: Tx991002Component;
  let fixture: ComponentFixture<Tx991002Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx991002Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx991002Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
