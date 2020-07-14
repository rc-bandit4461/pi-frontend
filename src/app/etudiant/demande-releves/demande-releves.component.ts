import {Component, OnInit} from '@angular/core';
import {EtudiantServiceService} from '../../services/etudiant-service.service';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {DemandeReleve, Etudiant, Filiere, SemestreEtudiant, Session} from '../../entities/entities';
import {AuthService} from '../../services/auth.service';
import {ToastrService} from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-demande-releves',
  templateUrl: './demande-releves.component.html',
  styleUrls: ['./demande-releves.component.css']
})
export class DemandeRelevesComponent implements OnInit {
  demandes: DemandeReleve[] = [];
  public isLoaded: boolean = false;
  public isError: boolean = false;

  constructor(private toastr:ToastrService,public etudiantService: EtudiantServiceService,public authService:AuthService, public httpClient: HttpClient, public common: CommonService) {
  }

  ngOnInit(): void {
    console.log('CALLED');
    this.getData();
    $('.attestationsModal').on('hidden.bs.modal', _ => {
      this.etudiantService.showRelevesModal = false;
      this.etudiantService.showAttestationModal = false;

    });

  }

  show() {
  }

  public async getData() {
    try {
      if (!this.etudiantService.etudiant) {
        this.etudiantService.etudiant = await this.httpClient.get<Etudiant>(this.common.url + '/etudiants/2').toPromise();
      }
      let data = await this.httpClient.get(this.common.url + '/demandeReleves/search/byEtudiantNotSeen?idEtudiant=' + this.etudiantService.etudiant.id).toPromise();
      this.demandes = <DemandeReleve[]> data['_embedded']['demandeReleves'];
      for (let demande of this.demandes) {
        demande.semestreEtudiant = await this.httpClient.get<SemestreEtudiant>(demande._links['semestreEtudiant']['href']).toPromise();
        demande.semestreEtudiant.session = await this.httpClient.get<Session>(demande.semestreEtudiant._links['session']['href']).toPromise();
        demande.session = demande.semestreEtudiant.session;
        demande.session.filiere = await this.httpClient.get<Filiere>(demande.session._links['filiere']['href']).toPromise();
      }
      console.log('YES');
      console.log(this.demandes);
      this.isLoaded = true;
      $('.attestationsModal').modal('toggle');

    } catch (e) {
      console.log(e);
      this.isError = true;
      $('.attestationsModal').modal('toggle');
    }
  }

  onClearRequest(demande: DemandeReleve) {
    this.httpClient.get(this.common.url + '/makeReleveRequestSeen/' + demande.id).subscribe(value => {
      demande.seen = true;
      this.etudiantService.demandeReleveCount--;
      this.etudiantService.verifyCountPositive();
    }, error => {
      this.toastr.error( 'Une erreure a empeché la mise a jour des données ');
      console.log(error);

    });
  }
}
