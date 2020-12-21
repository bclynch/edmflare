import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLoginsComponent } from './social-logins.component';

describe('SocialLoginsComponent', () => {
  let component: SocialLoginsComponent;
  let fixture: ComponentFixture<SocialLoginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialLoginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialLoginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
