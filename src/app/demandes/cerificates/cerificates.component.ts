import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';
import {Demande, DemandeAttestation, Etudiant, Filiere, Session} from '../../entities/entities';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-cerificates',
  templateUrl: './cerificates.component.html',
  styleUrls: ['./cerificates.component.css']
})
export class CerificatesComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  session: Session;
  filiere: Filiere;
  isLoaded: boolean = false;
  isError: boolean = false;
  dtOptions = {
    order: [[0, 'desc']],
    'language': {
      url: 'assets/French.json'
    },
    'columnDefs': [
      {
        'targets': [-1, -2],
        'orderable': false
      }
    ]
  };
  dtTrigger: any = new Subject();
  demandes: DemandeAttestation[] = [];

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    try {

    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
    }catch (e) {
      console.log(e);
    }
  }

  constructor(private httpClient: HttpClient, private common: CommonService) {
  }

  ngOnInit(): void {
    this.initData();
  }

  async initData() {
    try {
      let data = await this.httpClient.get(this.common.url + '/demandeAttestations/search/byProcessed?processed=false').toPromise();
      this.demandes = data['_embedded']['demandeAttestations'];
      console.log(this.demandes);
      for (let demande of this.demandes) {
        demande.etudiant = await this.httpClient.get<Etudiant>(demande._links['etudiant']['href']).toPromise();
        demande.session = await this.httpClient.get<Session>(demande._links['session']['href']).toPromise();
        demande.session.filiere = await this.httpClient.get<Filiere>(demande.session._links['filiere']['href']).toPromise();
      }
      this.isLoaded = true;
      console.log(this.demandes);
      this.rerender();
    } catch (e) {
      this.isError = true;
      console.log(e);
    }

  }

  onResolve(demande: DemandeAttestation) {
    console.log(demande);
    if (!confirm('Confirmer')) {
      return;
    }
    this.httpClient.get(this.common.url + '/resolveRequest/' + demande.id).subscribe(async value => {
      this.updateDemande(demande);
      this.rerender();
    }, error => {
      this.common.toastMessage('Errror', 'resolveRequest');
      throw error;
    });
  }

  async updateDemande(demande: DemandeAttestation) {
    let updateDemande: DemandeAttestation = await this.httpClient.get<DemandeAttestation>(demande._links['self']['href']).toPromise();
    demande.rejected = updateDemande.rejected;
    demande.done = updateDemande.done;
  }

  onDeny(demande: DemandeAttestation) {
    console.log(demande);
    if (!confirm('Confirmer')) {
      return;
    }
    this.httpClient.get(this.common.url + '/denyRequest/' + demande.id).subscribe(async value => {
      this.updateDemande(demande);
      this.rerender();
    }, error => {
      this.common.toastMessage('Errror', 'resolveRequest');
      throw error;
    });
  }

  onDelete(demande: DemandeAttestation) {
    if (!confirm('Confirmer')) {
      return;
    }
    this.httpClient.delete(this.common.url + '/deleteRequest/' + demande.id).subscribe(async value => {
      // const index: number = this.demandes.indexOf(demande);
      // if (index != -1) {
      //   this.demandes.splice(index, 1);
      // }
      demande.deleted
      this.rerender();
    }, error => {
      this.common.toastMessage('Errror', 'resolveRequest');
      throw error;
    });
  }
}
