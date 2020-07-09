import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorktoggleComponent } from './worktoggle.component';

describe('WorktoggleComponent', () => {
  let component: WorktoggleComponent;
  let fixture: ComponentFixture<WorktoggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorktoggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorktoggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
