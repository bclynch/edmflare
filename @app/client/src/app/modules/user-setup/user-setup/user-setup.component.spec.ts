import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSetupComponent } from './user-setup.component';

describe('UserSetupComponent', () => {
  let component: UserSetupComponent;
  let fixture: ComponentFixture<UserSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
