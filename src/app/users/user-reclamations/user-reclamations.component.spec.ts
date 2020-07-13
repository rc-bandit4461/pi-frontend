import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReclamationsComponent } from './user-reclamations.component';

describe('UserReclamationsComponent', () => {
  let component: UserReclamationsComponent;
  let fixture: ComponentFixture<UserReclamationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserReclamationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReclamationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
