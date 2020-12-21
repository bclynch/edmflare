import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsWrapperComponent } from './settings-wrapper.component';

describe('SettingsWrapperComponent', () => {
  let component: SettingsWrapperComponent;
  let fixture: ComponentFixture<SettingsWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
