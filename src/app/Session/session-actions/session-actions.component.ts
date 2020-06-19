import {Component, OnInit} from '@angular/core';
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

declare var $: any;


@Component({
  selector: 'app-session-actions',
  templateUrl: './session-actions.component.html',
  styleUrls: ['./session-actions.component.css']
})
export class SessionActionsComponent implements OnInit {
  session: Session;
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
  activateDownload = false;
  clickedEtudiant: Etudiant;
  public isAllDataGathered: boolean = false;
  public noteEtudiants: NoteEtudiant[];
  public file: any;
  fileUrl: any;

  constructor(private sanitizer: DomSanitizer, private httpClient: HttpClient, private common: CommonService, private activatedRoute: ActivatedRoute, private attestationService: AttestationService) {


  }

  async ngOnInit(): Promise<void> {
    let id = this.activatedRoute.snapshot.params.id;
    await this.getInitialData(id);
    await this.loadSemestreFilieres();
  }

  async getInitialData(id) {

    try {
      this.session = await this.httpClient.get<Session>(this.common.url + '/sessions/' + id).toPromise();
      this.filiere = await this.httpClient.get<Filiere>(this.session._links['filiere']['href']).toPromise();
      this.session.filiere = this.filiere;
      this.filiere.diplome = await this.httpClient.get<Diplome>(this.filiere._links['diplome']['href']).toPromise();
      let data;
      await this.httpClient.get<EtudiantSession>(this.session._links['etudiantSessions']['href']).subscribe(async value => {
        data = value;
        this.etudiantSessions = data['_embedded']['etudiantSessions'];
        for (let etudSession of this.etudiantSessions) {
          let etudiant = await this.httpClient.get<Etudiant>(this.common.url + '/etudiants/' + etudSession.id['etudiantId']).toPromise();
          etudiant['selectedAttestation'] = false;
          etudiant['etudiantSession'] = etudSession;
          this.etudiantsList.push(etudiant);
        }
        this.isLoaded = true;
      }, error => {
        console.log(error);
      this.common.toastMessage('Erreur', 'Une erreur est survenue lors de limportation de donnees');
      });
    } catch (e) {
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
      console.log(this.modulesList);
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
    }, error => {

      this.common.toastMessage('Erreur', 'Erreur s\'est survenue lors de lenregistrement');
      console.log(error);
    });


  }

  async onClickEtudiant(etudiant: Etudiant) {
    this.clickedEtudiant = etudiant;


  }

  fileChanged($event) {
    this.file = $event.target.files[0];

  }


  onChangeToggleAttestation($event: MatSlideToggleChange, etudiant: Etudiant) {
    etudiant['selectedAttestation'] = $event.checked;
  }

  async GenerateCertificates() {
    if (!this.file) {
      this.common.toastMessage('Info', 'Choisir un fichier template (docx)');
      return;
    }
    if (this.file.name.lastIndexOf('.docx') == -1) {
      this.common.toastMessage('Info', 'Choisir un fichier de type (docx)');
      return;
    }
    if (this.file.size == 0) {
      this.common.toastMessage('Info', 'Le fichier choisit est vide.');
      return;

    }
      try{
         let fileReader = new FileReader();
    fileReader.onload = async (e) => {
      console.log(fileReader.result);
      let etudiants: Etudiant[] = [];
      for (const etudiant of this.etudiantsList) {
        if (etudiant['selectedAttestation']) {
          etudiants.push(etudiant);
        }
      }
      let data = await this.attestationService.generateAS(this.session, etudiants, fileReader.result);
      // let blob: Blob;
      // blob = new Blob([data], {type: 'application/octet-stream'});
      //
      // this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
      // this.activateDownload = true;
    };
    fileReader.readAsBinaryString(this.file);
      }catch (e) {
        console.log(e);
        this.common.toastMessage('Erreur','Une erreur est survenue lors de génération du document');
      }

  }
}
