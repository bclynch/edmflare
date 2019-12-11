import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPreferencesComponent } from './notification-preferences.component';

describe('NotificationPreferencesComponent', () => {
  let component: NotificationPreferencesComponent;
  let fixture: ComponentFixture<NotificationPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
