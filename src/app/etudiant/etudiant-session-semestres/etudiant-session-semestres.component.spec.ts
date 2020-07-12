import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantSessionSemestresComponent } from './etudiant-session-semestres.component';

describe('EtudiantSessionSemestresComponent', () => {
  let component: EtudiantSessionSemestresComponent;
  let fixture: ComponentFixture<EtudiantSessionSemestresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtudiantSessionSemestresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudiantSessionSemestresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
