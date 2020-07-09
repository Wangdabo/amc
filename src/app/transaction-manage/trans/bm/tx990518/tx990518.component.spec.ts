import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990518Component } from './tx990518.component';

describe('Tx990518Component', () => {
  let component: Tx990518Component;
  let fixture: ComponentFixture<Tx990518Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990518Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990518Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
