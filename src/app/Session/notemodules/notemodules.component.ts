import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {ActivatedRoute} from '@angular/router';
import {Etudiant, EtudiantSession, Element, NoteElementModule, NoteModule, Filiere, Module, Session} from '../../entities/entities';

declare var $: any;

@Component({
  selector: 'app-notemodules',
  templateUrl: './notemodules.component.html',
  styleUrls: ['./notemodules.component.css']
})
export class NotemodulesComponent implements OnInit {
  etudiantsList: Etudiant[] = [];
  session: Session;
  module: Module;
  isLoaded: boolean = false;
  isError: boolean = false;
  etudiantSessions: EtudiantSession[];

  constructor(private httpClient: HttpClient, private common: CommonService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    let idSession = this.activatedRoute.snapshot.params.idSession;
    let idModule = this.activatedRoute.snapshot.params.idModule;
    this.loadData(idSession, idModule);
  }

  async loadData(idSession, idModule) {
    try {
      let data = await this.httpClient.get(this.common.url + '/sessions/' + idSession).toPromise();
      this.session = <Session> data;
      console.log(this.session);
      data = await this.httpClient.get(this.common.url + '/modules/' + idModule).toPromise();
      this.module = <Module> data;
      data = await this.httpClient.get(this.module._links['elements']['href']).toPromise();
      this.module.elements = data['_embedded']['elements'];

      console.log('module');
      console.log(this.module);
      this.session.filiere = await this.httpClient.get<Filiere>(this.session._links['filiere']['href']).toPromise();
      console.log('filiere');
      console.log(this.session.filiere);
      data = await this.httpClient.get<EtudiantSession>(this.common.url + '/etudiantSessions/search/bySession?id=' + this.session.id).toPromise();
      this.etudiantSessions = data['_embedded']['etudiantSessions'];
      console.log(data['_embedded']['etudiantSessions']);
      for (const etudiantSession of this.etudiantSessions) {
        console.log('etudiant');
        let etudiant = <Etudiant> <unknown> await this.httpClient.get<Etudiant>(this.common.url + '/etudiants/' + etudiantSession.id.etudiantId).toPromise();
        console.log(etudiant);
        etudiant['is_passed'] = etudiantSession.is_passed;
        etudiant['is_dropped'] = etudiantSession.is_dropped;
        etudiant.noteModule = <NoteModule> await this.httpClient.get<NoteModule>(this.common.url + '/noteModules/' + 'search/bymIdandsIdandeId?' + 'idEtudiant=' + etudiant.id + '&idSession=' + this.session.id + '&idModule=' + this.module.id).toPromise();
        console.log('noteModule');
        console.log(etudiant.noteModule);
        data = await this.httpClient.get(etudiant.noteModule._links['noteElementModules']['href']).toPromise();
        console.log('noteElementModules');
        etudiant.noteModule.noteElementModules = data['_embedded']['noteElementModules'];
        for (const noteElementModule of etudiant.noteModule.noteElementModules) {
          noteElementModule.element = await this.httpClient.get<Element>(noteElementModule._links['element']['href']).toPromise();
          noteElementModule.noteModule = etudiant.noteModule;
        }

        this.etudiantsList.push(etudiant);
        $(document).ready(function() {
          var table = $('#notemodule-table').DataTable({
            order: [[0, 'asc']],
            rowGroup: {
              dataSrc: '0'
            }
          });
        });

      }
      console.log(this.etudiantsList);
      this.isLoaded = true;
    } catch (e) {
      this.isError = true;
      this.common.toastMessage(this.common.messages.error.title, this.common.messages.error.message.get);
      console.log(e);
    }
  }

  onLoadTable($event: Event) {
    console.log('Loaded');
    console.log($event);
  }

  onConsistNoteElementModule(noteElementModule: NoteElementModule) {
      if(!confirm("Etes vous sure de vouloir continuer?")) return;
      this.httpClient.get(this.common.url + '/consisteNoteElementModule/' + noteElementModule.id).subscribe(value => {
      this.common.toastMessage(this.common.messages.success.title, this.common.messages.success.message.update);

      },error => {
      this.common.toastMessage(this.common.messages.error.title, this.common.messages.error.message.get);

      });
  }

  onConsisteNoteModule(noteModule: NoteModule) {
       if(!confirm("Etes vous sure de vouloir continuer?")) return;
      this.httpClient.get(this.common.url + '/consisteNoteModule/' + noteModule.id).subscribe(value => {
      this.common.toastMessage(this.common.messages.success.title, this.common.messages.success.message.update);

      },error => {
      this.common.toastMessage(this.common.messages.error.title, this.common.messages.error.message.get);

      });
  }
}
