import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990211Component } from './tx990211.component';

describe('Tx990211Component', () => {
  let component: Tx990211Component;
  let fixture: ComponentFixture<Tx990211Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990211Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990211Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
