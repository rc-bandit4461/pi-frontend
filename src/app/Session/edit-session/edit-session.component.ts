import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {ActivatedRoute} from '@angular/router';
import {Diplome, Etudiant, EtudiantSession, Filiere, Session} from '../../entities/entities';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.css']
})
export class EditSessionComponent implements OnInit {
  idSession: any;
  session: Session;
  filiere: Filiere;
  diplome: Diplome;
  etudiantSessions: EtudiantSession[] = [];
  isError: boolean = false;
  isLoaded: boolean = false;

  constructor(private httpClient: HttpClient, private common: CommonService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.idSession = this.activatedRoute.snapshot.params.id;
    this.loadData();
  }

  async loadData() {
    try {
      this.session = <Session> <unknown> await this.httpClient.get<Session>(this.common.url + '/sessions/' + this.idSession).toPromise();
      this.filiere = this.session.filiere = <Filiere> <unknown> await this.httpClient.get<Filiere>(this.session._links['filiere']['href']).toPromise();
      this.diplome =this.session.filiere.diplome =<Diplome> <unknown> await this.httpClient.get(this.filiere._links['diplome']['href']).toPromise();
      let data = await this.httpClient.get(this.session._links['etudiantSessions']['href']).toPromise();
      this.etudiantSessions = data['_embedded']['etudiantSessions'];
      for (const etudiantSession of this.etudiantSessions) {
        etudiantSession.etudiant = <Etudiant> await this.httpClient.get(this.common.url + '/etudiants/' + etudiantSession.id.etudiantId).toPromise();
      }
      this.isLoaded = true;
    } catch (e) {
      this.isError = true;
    }
  }

  onSubmit(value: any) {

  }
}
