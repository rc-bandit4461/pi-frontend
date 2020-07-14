import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {ActivatedRoute} from '@angular/router';
import {Diplome, Etudiant, EtudiantSession, Filiere, Session} from '../../entities/entities';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {DataTableDirective} from 'angular-datatables';
import {Subject} from 'rxjs';
import {ToastrModule, ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.css']
})
export class EditSessionComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  idSession: any;
  session: Session;
  filiere: Filiere;
  diplome: Diplome;
  etudiantSessions: EtudiantSession[] = [];
  isError: boolean = false;
  isLoaded: boolean = false;
  searchCin: string = '';
  etudiantsList: Etudiant[] = [];
  private searchedStudent: Etudiant;
  dtOptions: any;
  dtTrigger: any = new Subject();

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  constructor(private toastr:ToastrService,private httpClient: HttpClient, public common: CommonService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.idSession = this.activatedRoute.snapshot.params.id;

    this.dtOptions = {
      order: [[0, 'asc']],
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
    this.initData();

  }

  async initData() {
    try {
      this.session = <Session> <unknown> await this.httpClient.get<Session>(this.common.url + '/sessions/' + this.idSession).toPromise();
      this.filiere = this.session.filiere = <Filiere> <unknown> await this.httpClient.get<Filiere>(this.session._links['filiere']['href']).toPromise();
      this.diplome = this.session.filiere.diplome = <Diplome> <unknown> await this.httpClient.get(this.filiere._links['diplome']['href']).toPromise();
      let data = await this.httpClient.get(this.session._links['etudiantSessions']['href']).toPromise();
      this.etudiantSessions = data['_embedded']['etudiantSessions'];
      for (const etudiantSession of this.etudiantSessions) {
        etudiantSession.etudiant = <Etudiant> await this.httpClient.get(this.common.url + '/etudiants/' + etudiantSession.id.etudiantId).toPromise();
        etudiantSession['is_changed'] = false;
        etudiantSession['is_dropped_changed'] = etudiantSession['is_dropped'];
        etudiantSession.etudiant.etudiantSession = etudiantSession;
        this.etudiantsList.push(etudiantSession.etudiant);

      }
      this.rerender();
      console.log(this.etudiantsList);
      this.isLoaded = true;
    } catch (e) {
      this.isError = true;
    }
  }

  onSubmit(value: any) {
    if(!confirm("Etes vous sure de vouloir continuer?")) return;
    console.log(value);
    let session = {
      etudiantSessions: [],
      annee_courante:this.session.annee_courante,
      id:this.session.id,
      annee:this.session.annee,
    }


    for (let etudiant of this.etudiantsList ) {
      if(etudiant.etudiantSession['is_new'] || etudiant.etudiantSession.is_dropped != etudiant.etudiantSession['is_dropped_changed']){
        let etudiantSession = new EtudiantSession();
        etudiantSession.id.etudiantId = etudiant.id;
        etudiantSession.id.sessionId = this.session.id;
        etudiantSession.is_dropped = etudiant.etudiantSession['is_dropped_changed'];
        session.etudiantSessions.push(etudiantSession);
      }
    }
    this.httpClient.put(this.common.url + '/saveSession',session).subscribe(value1 => {
      this.toastr.success(this.common.messages.success.message.update);

    for (let etudiant of this.etudiantsList ) {
      if(etudiant.etudiantSession['is_new'] || etudiant.etudiantSession.is_dropped != etudiant.etudiantSession['is_dropped_changed']){
          etudiant.etudiantSession['is_new'] = false;
          etudiant.etudiantSession.is_dropped = etudiant.etudiantSession['is_dropped_changed'];
      }
    }
    },error => {
      console.log(error);
      this.toastr.error(this.common.messages.error.message.update);
    });
  }

  onSelectAll($event: MatSlideToggleChange) {
    for (let etudiantSession of this.etudiantSessions) {
      etudiantSession['is_changed'] = true;
      etudiantSession['is_dropped_changed'] = !$event.checked;
    }
  }

  onToggleEtudiant($event: MatSlideToggleChange, etudiantSession: EtudiantSession) {
    etudiantSession['is_dropped_changed'] = !$event.checked;

  }

  onRemoveEtudiant($event: MouseEvent, etudiant: Etudiant) {
      if(!confirm("Etes vous sure de vouloir continuer?")) return;

      this.httpClient.delete(this.common.url + '/deleteEtudiantSession/' + this.session.id + '/' + etudiant.id).subscribe(value => {
      this.toastr.success(this.common.messages.success.message.delete);

      },error => {

      this.toastr.error(this.common.messages.error.message.delete);
      });
  }

  onSearchCin($event: Event) {
    if (!this.searchCin) {
      this.toastr.warning( 'Inserer un CIN dabord');
      return;
    }
    console.log(this.searchCin);
    this.httpClient.get(this.common.url + '/etudiants/search/byCin?var=' + this.searchCin.toUpperCase()).subscribe(value => {
      if (value['_embedded']['etudiants']?.length > 0) {
        this.searchedStudent = value['_embedded']['etudiants'][0];
        for (let etudiant of this.etudiantsList) {
          if (etudiant.cin.toUpperCase() == this.searchedStudent.cin.toUpperCase()) {
            this.toastr.info( 'Cet étudiant est déja dans la liste.');
            return;
          }
        }
        let etudiantSession = new EtudiantSession();
        etudiantSession.id.etudiantId = this.searchedStudent.id;
        etudiantSession.id.sessionId = this.session.id;
        etudiantSession.etudiant = this.searchedStudent;
        etudiantSession.is_dropped = true;
        etudiantSession['is_changed'] = true;
        etudiantSession['is_new'] = true;
        etudiantSession['is_dropped_changed'] = false;

        this.searchedStudent.etudiantSession = etudiantSession;
        this.etudiantsList.push(this.searchedStudent);
        console.log(this.searchedStudent);
        this.rerender();
      }

    });

  }

}
