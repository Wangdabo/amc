import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990519Component } from './tx990519.component';

describe('Tx990519Component', () => {
  let component: Tx990519Component;
  let fixture: ComponentFixture<Tx990519Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990519Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990519Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
