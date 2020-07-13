import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import {Reclamation, User} from '../../entities/entities';
import {ReleveService} from '../../services/releve.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {ActivatedRoute} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-reclamations-list',
  templateUrl: './reclamations-list.component.html',
  styleUrls: ['./reclamations-list.component.css']
})
export class ReclamationsListComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  isLoaded = false;
  isError = false;
  reclamations: Reclamation[] = [];
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
  currentReclamation: Reclamation;

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


  constructor(private releveService: ReleveService, private sanitizer: DomSanitizer, private httpClient: HttpClient, public common: CommonService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      let data = await this.httpClient.get(this.common.url + '/reclamations/search/byProcessed?processed=false').toPromise();
      this.reclamations = data['_embedded']['reclamations'];
      console.log(this.reclamations);
      for (const reclamation of this.reclamations) {
        reclamation.user = await this.httpClient.get<User>(reclamation._links['user']['href']).toPromise();

      }
      this.rerender();
      this.isLoaded = true;

    } catch (e) {
      this.isError = false;
      console.log(e);
    }
  }

  onResolve(demande: Reclamation) {
    console.log(demande);
    if (!confirm('Confirmer')) {
      return;
    }
    let feedback = prompt("Feedback");
    this.httpClient.post(this.common.url + '/resolveReclamation/' + demande.id,{feedback:feedback}).subscribe(async value => {
      this.updateDemande(demande);
      this.rerender();
    }, error => {
      this.common.toastMessage('Errror', 'resolveRequest');
      throw error;
    });
  }

  async updateDemande(demande: Reclamation) {
    let updateDemande: Reclamation = await this.httpClient.get<Reclamation>(demande._links['self']['href']).toPromise();
    demande.rejected = updateDemande.rejected;
    demande.done = updateDemande.done;
  }

  onDeny(demande: Reclamation) {
    console.log(demande);
    if (!confirm('Confirmer')) {
      return;
    }
    let feedback = prompt("Feedback");
    this.httpClient.post(this.common.url + '/denyReclamation/' + demande.id, {feedback:feedback}).subscribe(async value => {
      this.updateDemande(demande);
      this.rerender();
    }, error => {
      this.common.toastMessage('Errror', 'Couldn\t execute query');
      throw error;
    });
  }

  onDelete(demande: Reclamation) {
    if (!confirm('Confirmer')) {
      return;
    }
    this.httpClient.delete(this.common.url + '/deleteReclamation/' + demande.id).subscribe(async value => {
      demande.deleted = true;
      this.rerender();
    }, error => {
      this.common.toastMessage('Errror', 'Couldn\t execute query');
      throw error;
    });
  }

  onDetails(reclamation: Reclamation) {
    this.currentReclamation = reclamation;
    $('.showReclamationModal').modal('show');
  }
}
