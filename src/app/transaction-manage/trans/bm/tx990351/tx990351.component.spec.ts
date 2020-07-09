import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990351Component } from './tx990351.component';

describe('Tx990351Component', () => {
  let component: Tx990351Component;
  let fixture: ComponentFixture<Tx990351Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990351Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990351Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
