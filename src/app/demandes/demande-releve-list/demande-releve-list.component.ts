import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DemandeReleve, Etudiant, Filiere, SemestreEtudiant, Session} from '../../entities/entities';
import {ReleveService} from '../../services/releve.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-demande-releve-list',
  templateUrl: './demande-releve-list.component.html',
  styleUrls: ['./demande-releve-list.component.css']
})
export class DemandeReleveListComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  isLoaded = false;
  isError = false;
  demandeReleves: DemandeReleve[] = [];
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
    } catch (e) {
      console.log(e);
    }
  }


  constructor(private releveService: ReleveService, private sanitizer: DomSanitizer, private httpClient: HttpClient, private common: CommonService, private activatedRoute: ActivatedRoute) {


  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      let data = await this.httpClient.get(this.common.url + '/demandeReleves/search/byProcessed?processed=false').toPromise();
      this.demandeReleves = data['_embedded']['demandeReleves'];
      console.log(this.demandeReleves);
      for (const demandeReleve of this.demandeReleves) {
        demandeReleve.semestreEtudiant = <SemestreEtudiant> await this.httpClient.get(demandeReleve._links['semestreEtudiant']['href']).toPromise();
        demandeReleve.semestreEtudiant.etudiant = <Etudiant> await this.httpClient.get(demandeReleve.semestreEtudiant._links['etudiant']['href']).toPromise();
        demandeReleve.semestreEtudiant.session = <Session> await this.httpClient.get(demandeReleve.semestreEtudiant._links['session']['href']).toPromise();
        demandeReleve.semestreEtudiant.session.filiere = <Filiere> await this.httpClient.get(demandeReleve.semestreEtudiant.session._links['filiere']['href']).toPromise();
      }
      this.rerender();
      this.isLoaded = true;

    } catch (e) {
      this.isError = false;
      console.log(e);
    }
  }

  onResolve(demande: DemandeReleve) {
    console.log(demande);
    if (!confirm('Confirmer')) {
      return;
    }
    this.httpClient.get(this.common.url + '/resolveReleveRequest/' + demande.id).subscribe(async value => {
      this.updateDemande(demande);
      this.rerender();
    }, error => {
      this.common.toastMessage('Errror', 'resolveRequest');
      throw error;
    });
  }

  async updateDemande(demande: DemandeReleve) {
    let updateDemande: DemandeReleve = await this.httpClient.get<DemandeReleve>(demande._links['self']['href']).toPromise();
    demande.rejected = updateDemande.rejected;
    demande.done = updateDemande.done;
  }

  onDeny(demande: DemandeReleve) {
    console.log(demande);
    if (!confirm('Confirmer')) {
      return;
    }
    this.httpClient.get(this.common.url + '/denyReleveRequest/' + demande.id).subscribe(async value => {
      this.updateDemande(demande);
      this.rerender();
    }, error => {
      this.common.toastMessage('Errror', 'resolveRequest');
      throw error;
    });
  }

  onDelete(demande: DemandeReleve) {
    if (!confirm('Confirmer')) {
      return;
    }
    this.httpClient.delete(this.common.url + '/deleteReleveRequest/' + demande.id).subscribe(async value => {
      const index: number = this.demandeReleves.indexOf(demande);
      if (index != -1) {
        this.demandeReleves.splice(index, 1);
      }
      this.rerender();
    }, error => {
      this.common.toastMessage('Errror', 'resolveRequest');
      throw error;
    });
  }
}
