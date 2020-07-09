import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Txt990600Component } from './txt990600.component';

describe('Txt990600Component', () => {
  let component: Txt990600Component;
  let fixture: ComponentFixture<Txt990600Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Txt990600Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Txt990600Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
