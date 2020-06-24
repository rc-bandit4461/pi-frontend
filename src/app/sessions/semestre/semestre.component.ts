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
  Diplome, SemestreEtudiant, NoteModule
} from '../../entities/entities';
import {AttestationService} from '../../services/attestation.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {pipe} from 'rxjs';
import {ReleveService} from '../../services/releve.service';
import {element} from 'protractor';

@Component({
  selector: 'app-semestre',
  templateUrl: './semestre.component.html',
  styleUrls: ['./semestre.component.css']
})
export class SemestreComponent implements OnInit {
  session: Session;
  filiere: Filiere;
  isLoaded: boolean = false;
  isError: boolean = false;
  etudiantSessions: EtudiantSession[] = [];
  etudiantsList: Etudiant[] = [];
  idSession: number;
  idSemestre: number;
  sessionSemestre: SemestreFiliere;
  file: any;

  constructor(private releveService: ReleveService, private sanitizer: DomSanitizer, private httpClient: HttpClient, private common: CommonService, private activatedRoute: ActivatedRoute, private attestationService: AttestationService) {


  }

  ngOnInit(): void {
    this.idSession = this.activatedRoute.snapshot.params.idSession;
    this.idSemestre = this.activatedRoute.snapshot.params.idSemestre;
    this.getInitialData(this.idSession, this.idSemestre);
  }

  async getInitialData(idSession, idSemestre) {

    try {
      this.session = await this.httpClient.get<Session>(this.common.url + '/sessions/' + idSession).toPromise();
      this.sessionSemestre = await this.httpClient.get<SemestreFiliere>(this.common.url + '/semestreFilieres/' + idSemestre).toPromise();

      this.filiere = await this.httpClient.get<Filiere>(this.session._links['filiere']['href']).toPromise();
      this.session.filiere = this.filiere;
      this.filiere.diplome = await this.httpClient.get<Diplome>(this.filiere._links['diplome']['href']).toPromise();
      let data;
      await this.httpClient.get<EtudiantSession>(this.session._links['etudiantSessions']['href']).subscribe(async value => {
        data = value;
        this.etudiantSessions = data['_embedded']['etudiantSessions'];
        for (let etudSession of this.etudiantSessions) {
          let etudiant = await this.httpClient.get<Etudiant>(this.common.url + '/etudiants/' + etudSession.id['etudiantId']).toPromise();
          etudiant['etudiantSession'] = etudSession;
          let semestre = await this.httpClient.get<SemestreEtudiant>(this.common.url + '/semestreEtudiants/search/query3?idSession=' + this.idSession + '&idEtudiant=' + etudiant.id + '&numero=' + this.sessionSemestre['numero']).toPromise();
          etudiant['semestreEtudiant'] = semestre;
          this.etudiantsList.push(etudiant);
        }
        console.log(this.etudiantsList);
        this.isLoaded = true;
        console.log(this.sessionSemestre);

      }, error => {
        console.log(error);
        this.isError = true;
        this.common.toastMessage('Erreur', 'Une erreur est survenue lors de limportation de donnees');
      });
    } catch (e) {
      this.isError = true;
      this.common.toastMessage('Erreur', 'Une erreur est survenue lors de limportation de donnees');
      console.log(e);
    }
  }


  onSelectEtudiant($event: MatSlideToggleChange, etudiant: Etudiant) {
    console.log($event);
    console.log(etudiant);
  }

  onUpdateSemestre() {

  }


  getNoteByNoteDeliberation(noteModule: NoteModule) {
    return noteModule.noteDeliberation;
  }

  getNoteWithoutDeliberation(noteModule: NoteModule) {
    return Math.max(noteModule.noteNormale, noteModule.noteRatt);

  }

  getBiggestNote(noteModule: NoteModule) {
    return Math.max(noteModule.noteNormale, noteModule.noteDeliberation, noteModule.noteRatt);
  }

  onFinishSemestre() {
    if (!confirm('Etes vous sure de vouloir continuer?')) {
      return;
    }
    this.httpClient.get(this.common.url + '/toggleCloseSemestre/' + this.idSemestre).subscribe(value => {
      this.sessionSemestre.done = !this.sessionSemestre.done;
    }, error => {

    });
  }

  fileChanged($event) {
    console.log("file changed");

    this.file = $event.target.files[0];
    console.log(this.file);
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
    let count = 0;
    for (const etudiant of this.etudiantsList) {
          if(etudiant['selected']) count++;
    }
    }
    try {
      let fileReader = new FileReader();
      fileReader.onload = async (e) => {
        console.log(fileReader.result);
        let entries = [];
        let etudiants: Etudiant[] = [];
        for (const etudiant of this.etudiantsList) {
          if (etudiant['selected']) {
            etudiants.push(etudiant);
          }
        }
        if (etudiants.length == 0) {
          this.common.toastMessage('Info', 'Choisir au moins un étudiant de la liste.');
          return;
        }
        // 'note': '11', //HERE
        // 'isPassed': true,
        //Getting data;
        for (const etudiant of etudiants) {
          let entry = {
            'semestreNumero': this.sessionSemestre.numero,
            'filiere': this.filiere,
            'session': this.session,
            'diplome': this.filiere.diplome,
            'isPassed': false,
            'note': 0,
            'modulesCount': 0,
            'nonPassedCount':0,
            'etudiant': {
              'prenom': etudiant.prenom.charCodeAt(0).toString().toUpperCase() + etudiant.prenom.substring(1).toLocaleLowerCase(),
              'nom': etudiant.nom.toUpperCase(),
              'cne': etudiant.cne.toUpperCase(),
              'cin': etudiant.cin.toUpperCase(),
              'date_naissance': etudiant.date_naissance,
              'ville_naissance': etudiant.ville_naissance.toUpperCase(),

            },
            'modules': []
          };
          entry.session.annee_courante = Math.ceil(this.sessionSemestre.numero/2) - 1  + entry.session.annee;
          entry['semestreNumero'] = this.sessionSemestre.numero;
          let data = await this.httpClient.get(etudiant.semestreEtudiant._links['noteModules']['href']).toPromise();
          etudiant.noteModules = data['_embedded']['noteModules'];
          for (const noteModule of etudiant.noteModules) {
            entry.modulesCount++;
            let data = await this.httpClient.get(noteModule._links['noteElementModules']['href']).toPromise();
            noteModule.noteElementModules = data['_embedded']['noteElementModules'];
            noteModule.module = await this.httpClient.get<Module>(noteModule._links['module']['href']).toPromise();

            let entryModule = noteModule;

            entryModule['libelle'] = noteModule.module['libelle'];
            // entryModule['description']= noteModule.module['description'];
            entryModule['isRatt'] = entryModule.is_ratt;
            entryModule.isPassed = true;
            let entryElements: any[] = [];
            noteModule.noteRatt = noteModule.noteDeliberation = noteModule.noteNormale = 0;
            let facteurSum = 0;
            for (const noteElementModule of noteModule.noteElementModules) {
              noteModule.noteNormale += noteElementModule.noteNormale * noteElementModule.facteur;
              noteModule.noteRatt += noteElementModule.noteRatt * noteElementModule.facteur;
              noteModule.noteDeliberation += noteElementModule.noteDeliberation * noteElementModule.facteur;
              facteurSum += noteElementModule.facteur;
              data = await this.httpClient.get<Element>(noteElementModule._links['element']['href']).toPromise();
              noteElementModule.element = <Element> data;
              if (Math.max(noteElementModule.noteNormale, noteElementModule.noteDeliberation, noteElementModule.noteRatt) < 5) {
                entryModule.isPassed = false;
                noteElementModule.is_passed = false;
                entry.nonPassedCount++;
              }
              let entryElement = {
                isPassed: noteElementModule.is_passed,
                noteNormale: noteElementModule['noteNormale'],
                noteDeliberation: noteElementModule['noteDeliberation'],
                noteRatt: noteElementModule['noteRatt'],
                isRatt: noteElementModule['is_ratt'],
                libelle: noteElementModule.element.libelle
              };

              entryElements.push(entryElement);
            }
            noteModule.noteNormale /= facteurSum;
            noteModule.noteDeliberation /= facteurSum;
            noteModule.noteRatt /= facteurSum;
            entryModule.noteRatt = noteModule.noteRatt;
            entryModule.noteDeliberation = noteModule.noteDeliberation;
            entryModule.noteNormale = noteModule.noteNormale;
            // if (Math.max(noteModule.noteNormale, noteModule.noteDeliberation, noteModule.noteRatt) >= 12) {
            //   entryModule.isPassed = true;
            // }
            entry.note += this.getBiggestNote(noteModule);

            entryModule['elements'] = entryElements;
            entry.modules.push(entryModule);

          }
          entry.note /= entry.modulesCount;
          if (entry.note >= 12 && entry.nonPassedCount < 2) {
            entry.isPassed = true;
          }
          entries.push(entry);
        }
        console.log(entries);

        let data = await this.attestationService.generateDocument({'entries': entries}, fileReader.result);
      };
      fileReader.readAsBinaryString(this.file);
    } catch (e) {
      console.log(e);
      this.common.toastMessage('Erreur', 'Une erreur est survenue lors de génération du document');
    }

  }

  private getPassedWithoutDeliberation(noteModule: NoteModule): boolean {
    if (noteModule.noteNormale >= 12 || noteModule.noteRatt >= 12) {
      return true;
    }
    return false;
  }

  private getPassedByDeliberation(noteModule: NoteModule): boolean {
    return noteModule.noteDeliberation >= 12;
  }

  onSelectAll($event: MatSlideToggleChange) {
            for (const etudiant of this.etudiantsList) {
                if(etudiant.etudiantSession.is_dropped) continue;
                etudiant['selected'] = $event.checked;
            }
  }
}
