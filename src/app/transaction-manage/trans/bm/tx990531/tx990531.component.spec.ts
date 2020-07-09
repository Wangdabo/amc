import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990531Component } from './tx990531.component';

describe('Tx990531Component', () => {
  let component: Tx990531Component;
  let fixture: ComponentFixture<Tx990531Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990531Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990531Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
