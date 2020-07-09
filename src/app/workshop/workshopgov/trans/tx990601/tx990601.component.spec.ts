import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990601Component } from './tx990601.component';

describe('Tx990601Component', () => {
  let component: Tx990601Component;
  let fixture: ComponentFixture<Tx990601Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990601Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990601Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
