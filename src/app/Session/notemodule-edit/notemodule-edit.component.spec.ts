import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotemoduleEditComponent } from './notemodule-edit.component';

describe('NotemoduleEditComponent', () => {
  let component: NotemoduleEditComponent;
  let fixture: ComponentFixture<NotemoduleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotemoduleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotemoduleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
