import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagewrapperComponent } from './pagewrapper.component';

describe('PagewrapperComponent', () => {
  let component: PagewrapperComponent;
  let fixture: ComponentFixture<PagewrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagewrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagewrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
