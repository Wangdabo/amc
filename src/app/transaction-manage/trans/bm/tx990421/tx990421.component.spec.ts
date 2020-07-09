import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990421Component } from './tx990421.component';

describe('Tx990421Component', () => {
  let component: Tx990421Component;
  let fixture: ComponentFixture<Tx990421Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990421Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990421Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
