import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventbriteCheckoutComponent } from './eventbrite-checkout.component';

describe('EventbriteCheckoutComponent', () => {
  let component: EventbriteCheckoutComponent;
  let fixture: ComponentFixture<EventbriteCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventbriteCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventbriteCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
