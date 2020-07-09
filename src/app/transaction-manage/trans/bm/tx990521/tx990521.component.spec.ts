import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990521Component } from './tx990521.component';

describe('Tx990521Component', () => {
  let component: Tx990521Component;
  let fixture: ComponentFixture<Tx990521Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990521Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990521Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
