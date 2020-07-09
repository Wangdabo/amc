import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitlebackComponent } from './titleback.component';

describe('TitlebackComponent', () => {
  let component: TitlebackComponent;
  let fixture: ComponentFixture<TitlebackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitlebackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitlebackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
