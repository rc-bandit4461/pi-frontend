import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExamsComponent } from './session-exams.component';

describe('SessionExamsComponent', () => {
  let component: SessionExamsComponent;
  let fixture: ComponentFixture<SessionExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionExamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
