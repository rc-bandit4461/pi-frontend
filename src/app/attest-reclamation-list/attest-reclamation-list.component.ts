import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Etudiant, ReclamAttestation} from '../entities/entities';
import {ReleveService} from '../services/releve.service';
import {CommonService} from '../services/common.service';

declare var $: any;
@Component({
  selector: 'app-attest-reclamation-list',
  templateUrl: './attest-reclamation-list.component.html',
  styleUrls: ['./attest-reclamation-list.component.css']
})
export class AttestReclamationListComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  isLoaded = false;
  isError = false;
  reclamations: ReclamAttestation[] = [];
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
  currentReclamation: ReclamAttestation;

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();

      this.dtTrigger.next();
    });
  }


  constructor(private toastr: ToastrService,private releveService: ReleveService, private sanitizer: DomSanitizer, private httpClient: HttpClient, public common: CommonService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      let data = await this.httpClient.get(this.common.url + '/reclamAttestations/search/byProcessed?processed=false').toPromise();
      console.log(data);
      this.reclamations = data['_embedded']['reclamAttestations'];
      console.log(this.reclamations);
      for (const reclamation of this.reclamations) {
        reclamation.etudiant = await this.httpClient.get<Etudiant>(reclamation._links['etudiant']['href']).toPromise();

      }
      this.rerender();
      this.isLoaded = true;

    } catch (e) {
      this.isError = false;
      console.log(e);
    }
  }

  onResolve(demande: ReclamAttestation) {
    console.log(demande);
    if (!confirm('Confirmer')) {
      return;
    }
    let feedback = prompt("Feedback");
    this.httpClient.post(this.common.url + '/resolveReclamAttestation/' + demande.id,{feedback:feedback}).subscribe(async value => {
      this.updateDemande(demande);
      this.rerender();
    }, error => {
      this.toastr.error('Une erreur s\'est arrivée lors de l\'execution de cette commande.');
      throw error;
    });
  }

  async updateDemande(demande: ReclamAttestation) {
    let updateDemande: ReclamAttestation = await this.httpClient.get<ReclamAttestation>(demande._links['self']['href']).toPromise();
    demande.rejected = updateDemande.rejected;
    demande.done = updateDemande.done;
  }

  onDeny(demande: ReclamAttestation) {
    console.log(demande);
    if (!confirm('Confirmer')) {
      return;
    }
    let feedback = prompt("Feedback");
    this.httpClient.post(this.common.url + '/denyReclamAttestation/' + demande.id, {feedback:feedback}).subscribe(async value => {
      this.updateDemande(demande);
      this.rerender();
    }, error => {
      this.toastr.error('Une erreur s\'est arrivée lors de l\'execution de cette commande.');
      throw error;
    });
  }

  onDelete(demande: ReclamAttestation) {
    if (!confirm('Confirmer')) {
      return;
    }
    this.httpClient.delete(this.common.url + '/deleteReclamAttestation/' + demande.id).subscribe(async value => {
      demande.deleted = true;
      this.rerender();
    }, error => {
      this.toastr.error('Une erreur s\'est arrivée lors de l\'execution de cette commande.');
      throw error;
    });
  }

  onDetails(reclamation: ReclamAttestation) {
    this.currentReclamation = reclamation;
    $('.showReclamAttestaionModal').modal('show');
  }
}
