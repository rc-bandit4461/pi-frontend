import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeRelevesComponent } from './demande-releves.component';

describe('DemandeRelevesComponent', () => {
  let component: DemandeRelevesComponent;
  let fixture: ComponentFixture<DemandeRelevesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeRelevesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeRelevesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
