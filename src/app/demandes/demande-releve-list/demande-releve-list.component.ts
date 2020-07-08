import {Component, OnInit} from '@angular/core';
import {DemandeReleve, Etudiant, Filiere, SemestreEtudiant, Session} from '../../entities/entities';
import {ReleveService} from '../../services/releve.service';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-demande-releve-list',
  templateUrl: './demande-releve-list.component.html',
  styleUrls: ['./demande-releve-list.component.css']
})
export class DemandeReleveListComponent implements OnInit {
  isLoaded = false;
  isError = false;
  demandeReleves: DemandeReleve[] = [];
  dtOptions: any;

  constructor(public auth:AuthenticationService,private releveService: ReleveService, private sanitizer: DomSanitizer, private httpClient: HttpClient, private common: CommonService, private activatedRoute: ActivatedRoute) {


  }

  ngOnInit(): void {
    this.auth.authentication(false,'admin');
    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      let data = await this.httpClient.get(this.common.url + '/demandeReleves').toPromise();
      this.demandeReleves = data['_embedded']['demandeReleves'];
      console.log(this.demandeReleves);
      for (const demandeReleve of this.demandeReleves) {
        demandeReleve.semestreEtudiant = <SemestreEtudiant> await this.httpClient.get(demandeReleve._links['semestreEtudiant']['href']).toPromise();
        demandeReleve.semestreEtudiant.etudiant = <Etudiant> await this.httpClient.get(demandeReleve.semestreEtudiant._links['etudiant']['href']).toPromise();
        demandeReleve.semestreEtudiant.session = <Session> await this.httpClient.get(demandeReleve.semestreEtudiant._links['session']['href']).toPromise();
        demandeReleve.semestreEtudiant.session.filiere = <Filiere> await this.httpClient.get(demandeReleve.semestreEtudiant.session._links['filiere']['href']).toPromise();
      }
      this.dtOptions = {
        order: [[0, 'asc']],
        'language': {
          url: 'assets/French.json'
        },

      };
      this.isLoaded = true;

    } catch (e) {
      this.isError = false;
      console.log(e);
    }
  }
}
