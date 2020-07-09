import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTransactionComponent } from './dynamic-transaction.component';

describe('DynamicTransactionComponent', () => {
  let component: DynamicTransactionComponent;
  let fixture: ComponentFixture<DynamicTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
