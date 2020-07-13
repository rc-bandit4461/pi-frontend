import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Etudiant} from '../entities/entities';
import {CommonService} from './common.service';
import {AuthService} from './auth.service';
import {ServerService} from './server.service';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class EtudiantServiceService implements OnInit {

  etudiant: Etudiant;
  demandeReleveCount: number = 0;
  demandeAttestationCount: number = 0;
  demandesCount:number = 0;
  existDemandeNotSeen: boolean = false;
  showRelevesModal = false;
  showAttestationModal = false;

  constructor(public httpClient: HttpClient, public common: CommonService,public authService:AuthService,public server:ServerService) {

  }

  ngOnInit(): void {
    this.initData();
  }

  public async initData() {
    try {
      this.etudiant =<Etudiant> await this.httpClient.request('GET',this.common.url + '/etudiants/' + this.authService.user.id).toPromise();
      this.demandeReleveCount = <number> await this.httpClient.get<number>(this.common.url + '/demandeReleves/search/countNotSeen?idEtudiant=' + this.authService.user.id).toPromise();
      console.log("HERE THEY COME");
      console.log(this.demandeReleveCount);
      this.demandeAttestationCount = await this.httpClient.get<number>(this.common.url + '/demandeAttestations/search/countNotSeen?idEtudiant=' + this.authService.user.id).toPromise();
      console.log(this.demandeAttestationCount);
      this.demandesCount = <number>(this.demandeReleveCount.valueOf() + this.demandeAttestationCount.valueOf());
      console.log(this.demandesCount);
      this.verifyCountPositive();
    } catch (e) {
      console.log(e);
    }
  }

  getCount():number{
    console.log("DEMANDE COUNT");
    console.log(this.demandesCount);
    if(this.demandesCount > 0){
      console.log("YEEES SUPERIEUR");
    }
    return this.demandeReleveCount + this.demandeAttestationCount;
  }
  verifyCountPositive() {
    if (this.demandesCount > 0) {
      this.existDemandeNotSeen = true;
    } else {
      this.existDemandeNotSeen = false;
    }
  }
}
