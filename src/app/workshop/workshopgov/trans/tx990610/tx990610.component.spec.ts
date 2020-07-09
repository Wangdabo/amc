import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990610Component } from './tx990610.component';

describe('Tx990610Component', () => {
  let component: Tx990610Component;
  let fixture: ComponentFixture<Tx990610Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990610Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990610Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
