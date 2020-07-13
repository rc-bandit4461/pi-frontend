import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {
  Etudiant,
  EtudiantSession,
  Filiere,
  Element,
  Module,
  NoteEtudiant,
  SemestreFiliere,
  Session,
  Examen,
  Diplome
} from '../../entities/entities';
import {AttestationService} from '../../services/attestation.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {DataTableDirective} from 'angular-datatables';
import {Observable, Subject} from 'rxjs';

declare var $: any;


@Component({
  selector: 'app-session-actions',
  templateUrl: './session-actions.component.html',
  styleUrls: ['./session-actions.component.css']
})
export class SessionActionsComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  session: Session;
  idSession: number;
  isLoaded: boolean = false;
  etudiantSessions: EtudiantSession[] = [];
  etudiantsList: Etudiant[] = [];
  modulesList: Module[] = [];
  filiere: Filiere;
  examDetail: Examen = <Examen> {
    description: '',
    noteEtudiants: [],
    is_ratt: false,
    facteur: 1,
  };
  toggleSelect: number = 0;
  public isAllDataGathered: boolean = false;
  public noteEtudiants: NoteEtudiant[];
  isError: Boolean = false;
  dtTrigger: any = new Subject();
  examdtOptions = {
    'sDom': 'ftp',
    'language': {
      url: 'assets/French.json'
    },
    order: [[0, 'asc']],
    'columnDefs': [
      {
        'targets': [-1, -2],
        'orderable': false
      }
    ]
  };
  dtOptions = {
    'language': {
      url: 'assets/French.json'
    },
    order: [[0, 'asc']],
    'columnDefs': [
      {
        'targets': [-1, -2],
        'orderable': false
      }
    ]
  };

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

  constructor(private sanitizer: DomSanitizer, private httpClient: HttpClient, private common: CommonService, private activatedRoute: ActivatedRoute, private attestationService: AttestationService) {


  }

  ngOnInit(): void {
    this.idSession = this.activatedRoute.snapshot.params.id;
    this.getInitialData(this.idSession);
  }

  async getInitialData(id) {
    this.isError = false;
    this.isLoaded = false;
    this.etudiantsList = [];
    this.etudiantSessions = [];
    this.session = null;
    this.filiere = null;
    try {
      this.session = await this.httpClient.get<Session>(this.common.url + '/sessions/' + id).toPromise();
      this.filiere = await this.httpClient.get<Filiere>(this.session._links['filiere']['href']).toPromise();
      this.session.filiere = this.filiere;
      this.filiere.diplome = await this.httpClient.get<Diplome>(this.filiere._links['diplome']['href']).toPromise();
      await this.getEtudiantSessions();
      await this.loadSemestreFilieres();
      this.isLoaded = true;
      console.log(this.session);
      this.rerender();
    } catch (e) {
      this.isError = true;
      this.common.toastMessage('Erreur', 'Une erreur est survenue lors de limportation de donnees');
      console.log(e);
    }
  }

  async loadSemestreFilieres() {
    if (this.isAllDataGathered) {
      return;
    }
    try {
      let data;
      data = await this.httpClient.get<SemestreFiliere>(this.session._links['semestreFilieres']['href']).toPromise();
      this.session.semestreFilieres = data['_embedded']['semestreFilieres'];
      for (let semestre of this.session.semestreFilieres) {
        data = await this.httpClient.get<Module>(semestre._links['modules']['href']).toPromise();
        semestre.modules = data['_embedded']['modules'];
        for (let mod of semestre.modules) {
          data = await this.httpClient.get<Element>(mod._links['elements']['href']).toPromise();
          mod.elements = data['_embedded']['elements'];
          this.modulesList.push(mod);
        }
      }
      this.isAllDataGathered = true;
    } catch (e) {
      this.common.toastMessage('Erreur', 'Une erreur est survenue lors de limportation de donnees');
      console.log(e);
    }
  }

  async onAddExam() {

    await this.loadSemestreFilieres();
    if (this.isAllDataGathered) {
      $('#session-add-exam').modal('show');
    }

    // we need to get the modules
  }

  createNoteEtudiant() {
    this.noteEtudiants = [];
    this.etudiantsList.forEach(etud => {
      if (etud['selected'] != undefined && etud['selected'] == true) {
        let noteEudiant = new NoteEtudiant(etud, etud['note']);
        this.noteEtudiants.push(noteEudiant);

      }
    });
  }

  getModule(id): Module {
    for (let mod of this.modulesList) {
      for (let element of mod.elements) {
        if (element.id + '' == id) {
          return mod;
        }
      }
    }
  }

  onSubmitAddExam(value: any) {
    // console.log(value);
    let element: any = {
      id: value.element
    };
    element.id = value.element;

    // console.log(this.modulesList);

    this.examDetail['is_ratt'] = value.is_ratt;
    this.examDetail['element'] = element;
    this.examDetail['session'] = this.session;
    this.createNoteEtudiant();
    this.examDetail.noteEtudiants = this.noteEtudiants;
    this.examDetail['module'] = this.getModule(value.element);


    console.log(this.examDetail);
    this.httpClient.post(this.common.url + '/saveExamen', this.examDetail).subscribe(value1 => {
      console.log('Examen crée');
      this.common.toastMessage('Success', 'Examen crée');
      $('#session-add-exam').slideDown().modal('hide');
    }, error => {

      this.common.toastMessage('Erreur', 'Erreur s\'est survenue lors de lenregistrement');
      console.log(error);
    });
  }


  onChangeToggleAttestation($event: MatSlideToggleChange, etudiant: Etudiant) {
    etudiant['selectedAttestation'] = $event.checked;
  }
  async generateSuccessCertificates(){
    await this.generateCertificate("attestationReussiteTemplate.docx");
  }
  async generateScolariteCertificates(){
    await this.generateCertificate("attestationScolariteTemplate.docx");

  }
  async generateCertificate(fileName:string) {
    try {
      let fileReader = new FileReader();
      let file = await this.common.getFileAsBlobObserable(this.common.url + '/download?fileName='+fileName).toPromise();
      fileReader.readAsBinaryString(file);
      fileReader.onload = async (e) => {
        let etudiants: Etudiant[] = [];
        for (const etudiant of this.etudiantsList) {
          if (etudiant['selectedAttestation']) {
            etudiants.push(etudiant);
          }
        }
        if (etudiants.length == 0) {
          this.common.toastMessage('Info', 'Choisir au moins un étudiant de la liste.');
          return;
        }

        let entries = [];
        for (let etudiant of this.etudiantsList) {
          let entry = {
            annee_courante:new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
            diplomeDescription: this.filiere.diplome.description,
            filiereDescription: this.filiere.description,
            etudiant: {
              nom: etudiant.nom.toUpperCase(),
              prenom: this.common.capitalize(etudiant.prenom),
              date_naissance: {
                jour: new Date(etudiant.date_naissance).getDay(),
                mois: this.common.monthToFrench(new Date(etudiant.date_naissance).getMonth()),
                annee: new Date(etudiant.date_naissance).getFullYear()
              },
              ville_naissance: etudiant.ville_naissance
            }
          };
          entries.push(entry);
        }
        let data = await this.attestationService.generateDocument(entries, fileReader.result);
      };
    } catch (e) {
      console.log(e);
      this.common.toastMessage('Erreur', 'Une erreur est survenue lors de génération du document');
    }

  }


  async generateCertificates() {

    try {
      let fileReader = new FileReader();
      let file = await this.common.getFileAsBlobObserable(this.common.url + '/download?fileName=attestationScolariteTemplate.docx').toPromise();
      fileReader.readAsBinaryString(file);
      fileReader.onload = async (e) => {
        console.log(fileReader.result);
        let etudiants: Etudiant[] = [];
        for (const etudiant of this.etudiantsList) {
          if (etudiant['selectedAttestation']) {
            etudiants.push(etudiant);
          }
        }
        if (etudiants.length == 0) {
          this.common.toastMessage('Info', 'Choisir au moins un étudiant de la liste.');
          return;
        }
        let data = await this.attestationService.generateAS(this.session, etudiants, fileReader.result);
      };
    } catch (e) {
      console.log(e);
      this.common.toastMessage('Erreur', 'Une erreur est survenue lors de génération du document');
    }

  }

  onAddExamChangeCheckAllStudents($event: MatSlideToggleChange) {
    console.log($event);
    for (let etudiant of this.etudiantsList) {
      if (!etudiant['etudiantSession']['is_dropped']) {
        etudiant['selected'] = $event.checked;
      }
    }
    // $('#add-exam-table').DataTable().data();
  }

  onExpendSemestre(semestre: SemestreFiliere) {
    console.log('Expanded');
    semestre['show'] = !semestre['show'];
  }

  onUpdateEtudiantState(etudiant: Etudiant) {
    let includeExams = false;
    if (!confirm('Etes vous sure de vouloir continuer?')) {
      return;
    }
    if (confirm('Inclure examens?')) {
      includeExams = true;
    }

    let url = this.common.url + '/updateEtudiantSessionState/' + this.session.id + '/' + etudiant.id + '/noConsist';
    if (includeExams) {
      url = this.common.url + '/updateEtudiantSessionState/' + this.session.id + '/' + etudiant.id + '/consist';
    }
    this.httpClient.get(url).subscribe(value => {
      this.httpClient.get(this.common.url + '/etudiantSessions/search/bySessionAndEtudiant?idSession=' + this.session.id + '&idEtudiant=' + etudiant.id).subscribe(data => {
        etudiant.etudiantSession = <EtudiantSession> data;
        this.rerender();
      }, error => {
        this.common.toastMessage(this.common.messages.error.title, this.common.messages.error.message.get);
      });
      this.common.toastMessage(this.common.messages.success.title, this.common.messages.success.message.update);
    }, error => {
      this.common.toastMessage(this.common.messages.error.title, this.common.messages.error.message.update);
    });
  }

  onToggleSelectEtudiants() {
    if (this.toggleSelect == 1) {
      for (const etudiant of this.etudiantsList) {
        if (!etudiant['is_dropped']) {
          etudiant['selectedAttestation'] = true;
        }
      }
      this.toggleSelect = 2;
    } else if (this.toggleSelect == 0) {
      for (const etudiant of this.etudiantsList) {
        if (!etudiant['is_dropped'] && etudiant.etudiantSession['is_passed']) {
          etudiant['selectedAttestation'] = true;
        }
      }
      this.toggleSelect = 1;
    } else {

      for (const etudiant of this.etudiantsList) {
        if (!etudiant['is_dropped']) {
          etudiant['selectedAttestation'] = false;
        }
      }
      this.toggleSelect = 0;
    }
  }

  async getEtudiantSessions() {
    this.etudiantsList = [];
    let data = await this.httpClient.get<EtudiantSession>(this.session._links['etudiantSessions']['href']).toPromise();
    this.etudiantSessions = data['_embedded']['etudiantSessions'];
    for (let etudSession of this.etudiantSessions) {
      let etudiant = await this.httpClient.get<Etudiant>(this.common.url + '/etudiants/' + etudSession.id['etudiantId']).toPromise();
      etudiant['selectedAttestation'] = false;
      etudiant['etudiantSession'] = etudSession;
      this.etudiantsList.push(etudiant);
    }
  }

  async onUpdateSessionNotes() {
    let includeExams = false;
    if (!confirm('Etes vous sure de vouloir continuer?')) {
      return;
    }
    if (confirm('Inclure examens?')) {
      includeExams = true;
    }
    let etudiants = [];
    for (let etudiant of this.etudiantsList) {
        if(etudiant['selectedAttestation']) etudiants.push({
          id:etudiant.id
        });
    }
    let url = this.common.url + '/updateSessionNotes/' + this.session.id + '/noConsist';
    if (includeExams) {
      url = this.common.url + '/updateSessionNotes/' + this.session.id + '/consist';
    }
    try {

      await this.httpClient.post(url,etudiants).toPromise();
      for (let etudiant of this.etudiantsList) {
          let data = await this.httpClient.get<EtudiantSession>(this.common.url + '/etudiantSessions/search/bySessionAndEtudiant?idSession=' + this.session.id + '&idEtudiant=' + etudiant.id).toPromise();
        etudiant.etudiantSession = <EtudiantSession>data;
      }
      this.rerender();
    } catch (e) {
      this.common.toastMessage(this.common.messages.error.title, this.common.messages.error.message.update);
      console.log(e);
    }

  }
    async onUpdateSessionAllNotes() {
    let includeExams = false;
    if (!confirm('Etes vous sure de vouloir continuer?')) {
      return;
    }
    if (confirm('Inclure examens?')) {
      includeExams = true;
    }

    let url = this.common.url + '/updateSessionNotes/' + this.session.id + '/noConsist';
    if (includeExams) {
      url = this.common.url + '/updateSessionNotes/' + this.session.id + '/consist';
    }
    try {
      await this.httpClient.get(url).toPromise();
      await this.getEtudiantSessions();
      this.rerender();
    } catch (e) {
      this.common.toastMessage(this.common.messages.error.title, this.common.messages.error.message.update);
      console.log(e);
    }

  }

  onCloseSession() {
    if (!confirm('Etes vous sure de vouloir continuer?')) {
      return;
    }
    this.httpClient.get(this.common.url + '/closeSession/' + this.session.id).subscribe(value => {
      this.common.toastMessage(this.common.messages.success.title, this.common.messages.success.message.update);
      this.session.is_done = !this.session.is_done;
    }, error => {
      this.common.toastMessage(this.common.messages.error.title, this.common.messages.error.message.update);

    });
  }
}
