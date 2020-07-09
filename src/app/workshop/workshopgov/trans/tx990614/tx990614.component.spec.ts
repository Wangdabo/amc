import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990614Component } from './tx990614.component';

describe('Tx990614Component', () => {
  let component: Tx990614Component;
  let fixture: ComponentFixture<Tx990614Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990614Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990614Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
