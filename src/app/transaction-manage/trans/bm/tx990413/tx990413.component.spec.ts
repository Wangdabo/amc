import { async, ComponentFixture, TestBed } from "@angular/core/testing"

import { Tx990413Component } from "./tx990413.component"

describe("Tx990413Component", () => {
  let component: Tx990413Component
  let fixture: ComponentFixture<Tx990413Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Tx990413Component]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(Tx990413Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
