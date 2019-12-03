import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareDialogueComponent } from './share-dialogue.component';

describe('ShareDialogueComponent', () => {
  let component: ShareDialogueComponent;
  let fixture: ComponentFixture<ShareDialogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareDialogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
