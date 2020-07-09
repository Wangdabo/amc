import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcActivitesComponent } from './marc-activites.component';

describe('MarcActivitesComponent', () => {
  let component: MarcActivitesComponent;
  let fixture: ComponentFixture<MarcActivitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarcActivitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcActivitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
