import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsilderComponent } from './newsilder.component';

describe('NewsilderComponent', () => {
  let component: NewsilderComponent;
  let fixture: ComponentFixture<NewsilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
