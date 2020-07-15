import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root'
})
export class EtudiantAttestationService {


  private host=this.common.url + '/';

  constructor(private httpClient: HttpClient,private common:CommonService) { }

  getAttestation(id: number){
    console.log('getting Attestation');
    return this.httpClient.get(this.host+'attestation/'+id);
  }

  updateAttestation(id: number, student: any) {
    const headers = new HttpHeaders()
    .set("Content-Type", "application/json");
    console.log('before Update');
    return this.httpClient.put(this.host+'attestation/'+id,student,{headers});
  }

  postReclamation(reclamation:any){
    return this.httpClient.post(this.host+'attestReclamation/',reclamation);
  }}
