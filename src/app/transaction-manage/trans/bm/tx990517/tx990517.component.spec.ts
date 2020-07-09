import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990517Component } from './tx990517.component';

describe('Tx990517Component', () => {
  let component: Tx990517Component;
  let fixture: ComponentFixture<Tx990517Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990517Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990517Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
