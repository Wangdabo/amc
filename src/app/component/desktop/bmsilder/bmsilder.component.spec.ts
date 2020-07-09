import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BmsilderComponent } from './bmsilder.component';

describe('BmsilderComponent', () => {
  let component: BmsilderComponent;
  let fixture: ComponentFixture<BmsilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BmsilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BmsilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
