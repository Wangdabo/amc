import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990508Component } from './tx990508.component';

describe('Tx990508Component', () => {
  let component: Tx990508Component;
  let fixture: ComponentFixture<Tx990508Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990508Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990508Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
