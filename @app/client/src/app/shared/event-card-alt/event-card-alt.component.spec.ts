import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCardAltComponent } from './event-card-alt.component';

describe('EventCardAltComponent', () => {
  let component: EventCardAltComponent;
  let fixture: ComponentFixture<EventCardAltComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCardAltComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventCardAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
