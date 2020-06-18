import { Injectable } from '@angular/core';
import {Etudiant, Session} from '../entities/entities';

@Injectable({
  providedIn: 'root'
})
export class AttestationService{
  session:Session;
  etudiant:Etudiant;
  constructor() { }
  //Attestation de scholarité
  generateAS(session,etudiant){

  }
}
