import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tx990231bevComponent } from './tx990231bev.component';

describe('Tx990231bevComponent', () => {
  let component: Tx990231bevComponent;
  let fixture: ComponentFixture<Tx990231bevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tx990231bevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990231bevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
