import { TestBed } from '@angular/core/testing';

import { EtudiantAttestationService } from './etudiant-attestation.service';

describe('EtudiantAttestationService', () => {
  let service: EtudiantAttestationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtudiantAttestationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
