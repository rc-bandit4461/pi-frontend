import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionActionsComponent } from './session-actions.component';

describe('SessionActionsComponent', () => {
  let component: SessionActionsComponent;
  let fixture: ComponentFixture<SessionActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
