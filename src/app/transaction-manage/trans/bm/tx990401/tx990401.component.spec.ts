import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990401Component } from './tx990401.component';

describe('Tx990401Component', () => {
  let component: Tx990401Component;
  let fixture: ComponentFixture<Tx990401Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990401Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990401Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
