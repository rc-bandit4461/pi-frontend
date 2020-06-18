import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {ActivatedRoute} from '@angular/router';
import {Element, Examen, Filiere, Module, Session} from '../../entities/entities';

@Component({
  selector: 'app-session-exams',
  templateUrl: './session-exams.component.html',
  styleUrls: ['./session-exams.component.css']
})
export class SessionExamsComponent implements OnInit {
  isLoaded: boolean = false;
  examensList: Examen[] = [];
  session: Session;
  filiere: Filiere;

  constructor(private httpClient: HttpClient, private common: CommonService, private activatedRoute: ActivatedRoute) {


  }

  ngOnInit(): void {
    let sessionId = this.activatedRoute.snapshot.params.id;
    this.getInitialData(sessionId);
  }

  async getInitialData(sessionid: string) {
    let data = await this.httpClient.get(this.common.url + '/sessions/' + sessionid).toPromise();
    this.session = <Session> data;
    data = await this.httpClient.get(this.session._links['filiere']['href']).toPromise();
    this.filiere = <Filiere> data;
    data = await this.httpClient.get(this.common.url + '/examens/search/bySession?id=' + sessionid).toPromise();
    this.examensList = data['_embedded']['examens'];
    for (let examen of this.examensList) {
      data = await this.httpClient.get(examen._links['module']['href']).toPromise();
      examen['module'] = <Module> data;
      data = await this.httpClient.get(examen._links['element']['href']).toPromise();
      examen['element'] = <Element> data;
    }
    console.log(this.session);
    console.log(this.filiere);
    console.log(this.examensList);
    this.isLoaded = true;
  }

   onDeleteExam(examen: Examen) {
    if (!confirm('Etes vous sur de vouloir supprimer')) {
      return;
    }
    this.examensList.splice(this.examensList.indexOf(examen), 1);
    this.httpClient.delete(examen._links['self']['href']).subscribe(value => {
      this.common.toastMessage('Success', 'Examen Supprimé');
    }, error => {
      this.common.toastMessage('Erreur', 'Une erreur a empeché la suppression.');
      console.log(error);
    });
  }
}
