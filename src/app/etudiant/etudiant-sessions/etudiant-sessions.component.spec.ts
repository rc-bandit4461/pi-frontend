import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantSessionsComponent } from './etudiant-sessions.component';

describe('EtudiantSessionsComponent', () => {
  let component: EtudiantSessionsComponent;
  let fixture: ComponentFixture<EtudiantSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtudiantSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtudiantSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
