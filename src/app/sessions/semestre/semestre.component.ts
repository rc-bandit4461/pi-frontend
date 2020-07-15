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
  Diplome, SemestreEtudiant, NoteModule
} from '../../entities/entities';
import {AttestationService} from '../../services/attestation.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {Subject} from 'rxjs';
import {ReleveService} from '../../services/releve.service';
import {DataTableDirective} from 'angular-datatables';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-semestre',
  templateUrl: './semestre.component.html',
  styleUrls: ['./semestre.component.css']
})
export class SemestreComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  session: Session;
  filiere: Filiere;
  isLoaded: boolean = false;
  isError: boolean = false;
  etudiantSessions: EtudiantSession[] = [];
  etudiantsList: Etudiant[] = [];
  idSession: number;
  idSemestre: number;
  sessionSemestre: SemestreFiliere;
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

  constructor(private toastr:ToastrService,private releveService: ReleveService, private sanitizer: DomSanitizer, private httpClient: HttpClient, private common: CommonService, private activatedRoute: ActivatedRoute, private attestationService: AttestationService) {


  }

  ngOnInit(): void {
    this.idSession = this.activatedRoute.snapshot.params.idSession;
    this.idSemestre = this.activatedRoute.snapshot.params.idSemestre;
    this.dtOptions = {
          order: [[0, 'asc']],
          'language': {
            url: 'assets/French.json'
          },
          'columnDefs': [
            {
              'targets': [-1, -2, -3, -4, -5],
              'orderable': false
            }
          ]
        };
    this.getInitialData(this.idSession, this.idSemestre);
  }


  async getEtudiantsData() {
    this.isError = false;
    this.isLoaded = false;
    this.etudiantSessions = [];
    this.etudiantsList = [];
    try {
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
        this.isLoaded = true;
        this.rerender();
      }, error => {
        console.log(error);
        this.isError = true;
        this.toastr.error( 'Une erreur est survenue lors de limportation de donnees');

      });
    } catch (e) {
      this.isError = true;
      this.toastr.error( 'Une erreur est survenue lors de limportation de donnees');
      console.log(e);
    }

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
        this.rerender();
      }, error => {
        console.log(error);
        this.isError = true;
        this.toastr.error( 'Une erreur est survenue lors de limportation de donnees');

      });
    } catch (e) {
      this.isError = true;
      this.toastr.error( 'Une erreur est survenue lors de limportation de donnees');
      console.log(e);
    }
  }


  onSelectEtudiant($event: MatSlideToggleChange, etudiant: Etudiant) {
    console.log($event);
    console.log(etudiant);
  }

  onUpdateSemestreNotes() {
    let includeExams = false;
    if (!confirm('Etes vous sure de vouloir continuer?')) {
      return;
    }
    if (confirm('Inclure examens?')) {
      includeExams = true;
    }

    let url = this.common.url + '/updateSemestreNotes/' + this.sessionSemestre.id + '/noConsist';
    if (includeExams) {
      url = this.common.url + '/updateSemestreNotes/' + this.sessionSemestre.id;
    }
    this.httpClient.get(url).subscribe(value => {
      this.toastr.success( this.common.messages.success.message.update);
      // this.initVariables();
      this.getEtudiantsData();

    }, error => {
      this.toastr.error(this.common.messages.error.message.update);
    });
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


  async GenerateCertificates() {
    try {
      let fileReader = new FileReader();
            let file = await this.common.getFileAsBlobObserable(this.common.url + '/download?fileName=releveNoteTemplate.docx').toPromise();

      fileReader.readAsBinaryString(file);
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
          this.toastr.info( 'Choisir au moins un étudiant de la liste.');
          return;
        }
        for (const etudiant of etudiants) {
          let entry = {
            'semestreNumero': this.sessionSemestre.numero,
            'filiere': this.filiere,
            'session': this.session,
            'diplome': this.filiere.diplome,
            'isPassed': true,
            'note': etudiant.semestreEtudiant.note.toFixed(2),
            'modulesCount': 0,
            'nonPassedCount': 0,
            'etudiant': {
              'prenom': this.common.capitalize(etudiant.prenom),
              'nom': etudiant.nom.toUpperCase(),
              'cne': etudiant.cne.toUpperCase(),
              'cin': etudiant.cin.toUpperCase(),
              'date_naissance': {
                jour:new Date(etudiant.date_naissance).getDay(),
                mois:this.common.monthToFrench(new Date(etudiant.date_naissance).getMonth()),
                annee:new Date(etudiant.date_naissance).getFullYear(),
              },
              'ville_naissance': etudiant.ville_naissance.toUpperCase(),

            },
            'modules': []
          };
          entry.session.annee_courante = Math.ceil(this.sessionSemestre.numero / 2) - 1 + entry.session.annee;
          entry['semestreNumero'] = this.sessionSemestre.numero;
          let data = await this.httpClient.get(etudiant.semestreEtudiant._links['noteModules']['href']).toPromise();
          etudiant.noteModules = data['_embedded']['noteModules'];
          for (const noteModule of etudiant.noteModules) {
            let data = await this.httpClient.get(noteModule._links['noteElementModules']['href']).toPromise();
            noteModule.noteElementModules = data['_embedded']['noteElementModules'];
            noteModule.module = await this.httpClient.get<Module>(noteModule._links['module']['href']).toPromise();
            let entryModule = {
              noteNormale: noteModule.noteNormale.toFixed(2),
              noteRatt: noteModule.noteRatt.toFixed(2),
              noteDeliberation: noteModule.noteDeliberation.toFixed(2),
              isPassed: true,
              elements: [],
              libelle: noteModule.module.libelle
            };
            let entryElements: any[] = [];
            for (const noteElementModule of noteModule.noteElementModules) {
              data = await this.httpClient.get<Element>(noteElementModule._links['element']['href']).toPromise();
              noteElementModule.element = <Element> data;
              let entryElement = {
                isPassed: noteElementModule['noteDeliberation'] >= 12,
                isPassed1S: noteElementModule.noteNormale >= 12,
                s2Result: noteElementModule['noteDeliberation'] >= 12 ? 'V' : (noteModule.noteDeliberation >= 12 && noteElementModule.noteDeliberation >= 7 ? 'CMP' : 'NV'),
                noteNormale: noteElementModule['noteNormale'].toFixed(2),
                noteDeliberation: noteElementModule['noteDeliberation'].toFixed(2),
                noteRatt: noteElementModule['noteRatt'].toFixed(2),
                s1Result: noteElementModule['noteNormale'] >= 12 ? 'V' : (noteElementModule.noteNormale >= 5 ? 'Ratt' : 'NV'),
                isRatt: noteElementModule.noteNormale < 12 && noteElementModule.noteNormale >= 5,
                libelle: noteElementModule.element.libelle
              };
              if (noteElementModule.noteDeliberation < 7) {
                entryModule.isPassed = false;
                entry.isPassed = false;
              }
              entryElements.push(entryElement);
            }
             if (noteModule.noteDeliberation < 12) {
                entryModule.isPassed = false;
              }
            entryModule['elements'] = entryElements;
            if (etudiant.semestreEtudiant.note < 12) {
              entry.isPassed = false;
            }
            entry.modules.push(entryModule);
          }
          entries.push(entry);
        }
        console.log(entries);

        let data = await this.attestationService.generateDocument({'entries': entries}, fileReader.result,"Releve_" + this.session.filiere.libelle + "_" + this.session
          .annee + "_S" + this.sessionSemestre.numero);
      };
    } catch (e) {
      console.log(e);
      this.toastr.error( 'Une erreur est survenue lors de génération du document');
    }

  }
  onSelectAll($event: MatSlideToggleChange) {
    for (const etudiant of this.etudiantsList) {
      if (etudiant.etudiantSession.is_dropped) {
        continue;
      }
      etudiant['selected'] = $event.checked;
    }
  }

  onUpdateSemestreEtudiant(semestreEtudiant: SemestreEtudiant) {
    console.log(semestreEtudiant);
    let includeExams = false;
    // return;
    if (!confirm('Etes vous sure de vouloir continuer?')) {
      return;
    }
    if (confirm('Inclure examens?')) {
      includeExams = true;
    }

    let url = this.common.url + '/updateSemestreEtudiantNotes/' + semestreEtudiant.id + '/noConsist';
    if (includeExams) {
      url = this.common.url + '/updateSemestreEtudiantNotes/' + semestreEtudiant.id;
    }
    this.httpClient.get(url).subscribe(value => {
      this.toastr.success( this.common.messages.success.message.update);
      this.httpClient.get(semestreEtudiant._links.self.href).subscribe(data => {
        semestreEtudiant.note = data['note'];

        this.rerender();
      }, error => {
        this.toastr.error( this.common.messages.error.message.update);

      });
    }, error => {
      this.toastr.error( this.common.messages.error.message.update);
    });

  }
}
