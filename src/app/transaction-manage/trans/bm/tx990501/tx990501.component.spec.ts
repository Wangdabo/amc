import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990501Component } from './tx990501.component';

describe('Tx990501Component', () => {
  let component: Tx990501Component;
  let fixture: ComponentFixture<Tx990501Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Tx990501Component]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990501Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
