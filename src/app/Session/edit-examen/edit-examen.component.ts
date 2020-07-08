import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../services/common.service';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Element, Etudiant, EtudiantSession, Examen, Filiere, Module, NoteExamen, SemestreFiliere, Session} from '../../entities/entities';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {AuthenticationService} from '../../services/authentication.service';

declare var $: any;

@Component({
  selector: 'app-edit-examen',
  templateUrl: './edit-examen.component.html',
  styleUrls: ['./edit-examen.component.css']
})
export class EditExamenComponent implements OnInit {
  examDetail: Examen = new Examen();
  isError: boolean = false;
  isLoaded: boolean = false;
  session: Session;
  modulesList: Module[] = [];
  elementsList: Element[] = [];
  noteExamens: NoteExamen[] = [];
  etudiantsList: Etudiant[] = [];
  examinedEtudiants: Etudiant[] = [];
  element: Element;
  newElementId;

  curentElementId: any;
  private etudiantSessions: EtudiantSession[];

  constructor(public auth:AuthenticationService,private httpClient: HttpClient, private common: CommonService, private activatedRoute: ActivatedRoute) {


  }

  ngOnInit(): void {
    this.auth.authentication(false,'admin');
    let idExamen = this.activatedRoute.snapshot.params.id;
    this.loadData(idExamen);

  }

  async loadData(idExamen) {
    try {
      let data = await this.httpClient.get(this.common.url + '/examens/' + idExamen).toPromise();
      this.examDetail = <Examen> <unknown> data;
      data = await this.httpClient.get(this.examDetail._links['noteExamens']['href']).toPromise();
      this.noteExamens = data['_embedded']['noteExamens'];
      this.examDetail['noteExamens'] = this.noteExamens;
      for (const noteExamen of this.examDetail.noteExamens) {
        data = await this.httpClient.get(noteExamen._links['etudiant']['href']).toPromise();
        noteExamen.etudiant = <Etudiant> data;
        // this.examinedEtudiants.push(<Etudiant> data);
      }
      this.examDetail['module'] = <Module> <unknown> await this.httpClient.get(this.examDetail._links['module']['href']).toPromise();
      this.examDetail['element'] = this.element = <Element> <unknown> await this.httpClient.get(this.examDetail._links['element']['href']).toPromise();
      this.curentElementId = this.newElementId = this.examDetail['element']['id'];

      this.examDetail['semestreFiliere'] = <SemestreFiliere> <unknown> await this.httpClient.get(this.examDetail['module']._links['semestreFiliere']['href']).toPromise();
      this.session = this.examDetail['session'] = <Session> <unknown> await this.httpClient.get<Session>(this.examDetail['semestreFiliere']._links['session']['href']).toPromise();
      this.session.filiere = this.examDetail['session']['filiere'] = <Filiere> <unknown> await this.httpClient.get<Session>(this.examDetail['session']._links['filiere']['href']).toPromise();

      data = <EtudiantSession[]> await this.httpClient.get(this.session._links['etudiantSessions']['href']).toPromise();
      this.etudiantSessions = data['_embedded']['etudiantSessions'];
      let etudiant;
      console.log(this.etudiantSessions);
      for (const etudiantSession of this.etudiantSessions) {
        data = await this.httpClient.get(this.common.url + '/etudiants/' + etudiantSession['id']['etudiantId']).toPromise();
        etudiant = data;
        etudiant.is_dropped = etudiantSession.is_dropped;
        this.etudiantsList.push(etudiant);
      }
      console.log(this.etudiantsList);
      data = await this.httpClient.get(this.session._links['semestreFilieres']['href']).toPromise();
      this.session['semestreFilieres'] = <SemestreFiliere[]> <unknown> data['_embedded']['semestreFilieres'];
      for (const semestreFiliere of this.session['semestreFilieres']) {

        data = await this.httpClient.get(semestreFiliere._links['modules']['href']).toPromise();
        let modules = <Module[]> data['_embedded']['modules'];
        semestreFiliere['modules'] = modules;
        for (const module of modules) {
          this.modulesList.push(module);
          data = await this.httpClient.get(module._links['elements']['href']).toPromise();
          module['elements'] = <Element[]> data['_embedded']['elements'];
          module['elements'].forEach(element => {
            if (element.id == this.examDetail.element.id) {
              this.examDetail.element = element;
            }
            this.elementsList.push(element);
          });
        }
      }
      // data = await this.httpClient.get(this.common.url + '/etudiants/search/bySession?id=' + this.session.id).toPromise();
      // this.etudiantsList = <Etudiant[]> data['_embedded']['etudiants'];
      await this.mapPassedToEtudiantList();
      this.isLoaded = true;

      // console.log(this.examDetail);
      // console.log(this.session);
      // console.log(this.modulesList);
      console.log(this.etudiantsList);
    } catch (e) {
      this.isError = true;
      this.common.toastMessage(this.common.messages.error.title, this.common.messages.error.message.get);
    }
  }

  mapPassedToEtudiantList() {
    for (const etudiant of this.etudiantsList) {
      for (const noteExamen of this.examDetail.noteExamens) {
        if (noteExamen.etudiant.id != etudiant.id) {
          continue;
        }

        etudiant.is_examined = true;
        // etudiant.is_reexamined = true;
        // etudiant['currentNote'] = noteExamen.note;
        etudiant['newNote'] = noteExamen.note;
      }
    }
    for (const etudiant of this.etudiantsList) {
      if (!etudiant.is_examined) {
        // etudiant['currentNote'] = null;
        etudiant['newNote'] = null;

      }
    }
  }

  verifyNotes() {
    for (const etudiant of this.etudiantsList) {
      if (etudiant.is_examined && !etudiant['newNote']) {
        return false;
      }
    }
    return true;
  }

  getModuleByElementId(id) {
    for (const m of this.modulesList) {
      for (const element of m.elements) {
        if (element.id == id) {
          return m;
        }
      }
    }
  }
  onAddExamChangeCheckAllStudents($event: MatSlideToggleChange) {
    console.log($event);
      for(let etudiant of this.etudiantsList){
          if(!etudiant['is_dropped'])
          etudiant['is_examined'] = $event.checked;
        }
  }
  generateNoteExamens() {
    let noteExamens = [];
    this.etudiantsList.forEach(etudiant => {
      if (etudiant.is_examined) {
        noteExamens.push({
          note: etudiant['newNote'],
          etudiant: {id: etudiant.id}
        });
      }
    });
    return noteExamens;
  }

  onSubmitEditExam(event: Event, value: any) {
    let updatedExam = {
      id: this.examDetail.id,
      description: this.examDetail.description,
      module: {id: this.getModuleByElementId(this.newElementId).id},
      element: {id: this.newElementId},
      is_ratt: this.examDetail.is_ratt,
      facteur: this.examDetail.facteur,
      session:{id:this.session.id},
      noteExamens: this.generateNoteExamens()
    };
    // console.log(updatedExam);
    // return;
    if (!this.verifyNotes()) {
      this.common.toastMessage('Info', 'Verififer les informations des étudiants.');
      return;
    }
    if (!this.examDetail.description || !this.examDetail.facteur) {
      this.common.toastMessage('Info', 'Un ou plusieur champs et manquants');
      return;

    }
    this.httpClient.put(this.common.url + '/saveExamen', updatedExam).subscribe(value1 => {
      this.common.toastMessage(this.common.messages.success.title, this.common.messages.success.message.update);

    }, error => {
      console.log(error);
      this.common.toastMessage(this.common.messages.error.title, this.common.messages.error.message.update);
    });
  }


}
