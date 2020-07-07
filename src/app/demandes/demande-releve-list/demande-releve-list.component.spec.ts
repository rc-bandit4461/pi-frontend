import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeReleveListComponent } from './demande-releve-list.component';

describe('DemandeReleveListComponent', () => {
  let component: DemandeReleveListComponent;
  let fixture: ComponentFixture<DemandeReleveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandeReleveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeReleveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
