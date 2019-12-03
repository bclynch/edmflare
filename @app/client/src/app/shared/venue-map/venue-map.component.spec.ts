import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueMapComponent } from './venue-map.component';

describe('VenueMapComponent', () => {
  let component: VenueMapComponent;
  let fixture: ComponentFixture<VenueMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
