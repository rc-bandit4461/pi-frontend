import {Component, OnInit} from '@angular/core';
import {DemandeAttestation, DemandeReleve, Etudiant, Filiere, SemestreEtudiant, Session} from '../../entities/entities';
import {EtudiantServiceService} from '../../services/etudiant-service.service';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';

declare var $: any;

@Component({
  selector: 'demandes-attestation',
  templateUrl: './demandes.component.html',
  styleUrls: ['./demandes.component.css']
})
export class DemandesComponent implements OnInit {
  demandes: DemandeAttestation[] = [];
  public isLoaded: boolean = false;
  public isError: boolean = false;

  constructor(public etudiantService: EtudiantServiceService, public httpClient: HttpClient, public common: CommonService) {
  }

  ngOnInit(): void {
    console.log('CALLED');
    this.getData();
    $('.attestationsModal').on('hidden.bs.modal', _ => {
      this.etudiantService.showAttestationModal = false;
      this.etudiantService.showRelevesModal = false;

    });
  }

  show() {
  }

  public async getData() {

    try {
      if (!this.etudiantService.etudiant) {
        this.etudiantService.etudiant = await this.httpClient.get<Etudiant>(this.common.url + '/etudiants/2').toPromise();
      }
      let data = await this.httpClient.get(this.common.url + '/demandeAttestations/search/byEtudiantNotSeen?idEtudiant=' + this.etudiantService.etudiant.id).toPromise();
      this.demandes = <DemandeAttestation[]> data['_embedded']['demandeAttestations'];
      for (let demande of this.demandes) {
        demande.session = await this.httpClient.get<Session>(demande._links['session']['href']).toPromise();
        demande.session.filiere = await this.httpClient.get<Filiere>(demande.session._links['filiere']['href']).toPromise();
      }
      console.log('YES');
      console.log(this.demandes);
      this.isLoaded = true;
      $('.attestationsModal').modal('toggle');

    } catch (e) {
      console.log(e);
      this.isError = true;
      $('.attestationsModal').modal('hide');
    }
  }

  onClearRequest(demande: DemandeAttestation) {
    this.httpClient.get(this.common.url + '/makeRequestSeen/' + demande.id).subscribe(value => {
      demande.seen = true;
      this.etudiantService.demandeAttestationCount--;
      this.etudiantService.verifyCountPositive();


    }, error => {
      this.common.toastMessage('Erreur', 'Une erreure a empeché la mise a jour des données ');
      console.log(error);

    });
  }
}
