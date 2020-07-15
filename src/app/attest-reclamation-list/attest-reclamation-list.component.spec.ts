import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestReclamationListComponent } from './attest-reclamation-list.component';

describe('AttestReclamationListComponent', () => {
  let component: AttestReclamationListComponent;
  let fixture: ComponentFixture<AttestReclamationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttestReclamationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttestReclamationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
