import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedtableComponent } from './fixedtable.component';

describe('FixedtableComponent', () => {
  let component: FixedtableComponent;
  let fixture: ComponentFixture<FixedtableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedtableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
