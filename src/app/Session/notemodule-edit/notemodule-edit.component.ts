import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService, MessageType} from '../../services/common.service';
import {ActivatedRoute} from '@angular/router';
import {Element, Etudiant, EtudiantSession, Filiere, Module, NoteElementModule, NoteModule, Session} from '../../entities/entities';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {$e} from 'codelyzer/angular/styles/chars';
import {ToastrService} from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-notemodule-edit',
  templateUrl: './notemodule-edit.component.html',
  styleUrls: ['./notemodule-edit.component.css']
})
export class NotemoduleEditComponent implements OnInit {
  etudiantsList: Etudiant[] = [];
  session: Session;
  module: Module;
  isLoaded: boolean = false;
  isError: boolean = false;
  etudiantSessions: EtudiantSession[];
  selectAll: boolean = false;
  public dtOptions: any;

  constructor(private toastr:ToastrService,private httpClient: HttpClient, private common: CommonService, private activatedRoute: ActivatedRoute) {

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
        etudiant['selected'] = false;
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

        console.log(etudiant.noteModule.noteElementModules);
        this.etudiantsList.push(etudiant);

      }
      this.dtOptions = {
        order: [[0, 'asc']],

        rowGroup: {
          dataSrc: '0'
        },
        'columnDefs': [
           {
          'targets': [-1,-2,-3,-4,-5],
          'orderable': false
        }
        ]
      };
      // $(document).ready(function() {
      //   var table = $('#notemodule-table').DataTable(dtOptions);
      // });
      this.isLoaded = true;
    } catch (e) {
      this.isError = true;
      this.toastr.error( this.common.messages.error.message.get);
      console.log(e);
    }
  }

  verifyConsistency() {
    let isConsistent = true;
    for (const etudiant of this.etudiantsList) {

      for (let noteElementModule of etudiant.noteModule.noteElementModules) {
        if (!noteElementModule['selected']) {
          continue;
        }
        if (noteElementModule.noteNormale >= 12 && noteElementModule.is_ratt || noteElementModule.noteNormale < 5 && noteElementModule.is_ratt  ) {
          isConsistent = false;

        }
      }
    }
    if (isConsistent == false) {
      return false;
    }
    return true;
  }

  onClickSubmit() {

    let toUpdateNoteElementModules = [];
    let updatedNoteElementModules = [];
    if (!this.verifyConsistency()) {
      this.toastr.warning( 'Il existe des données qui sont inconsistentes.');
      return;
    }
    for (const etudiant of this.etudiantsList) {

      for (const noteElementModule of etudiant.noteModule.noteElementModules) {
        if (!noteElementModule['selected']) {
          continue;
        }
        updatedNoteElementModules.push(noteElementModule);
        let newNotElementModule = new NoteElementModule();
        newNotElementModule.noteDeliberation = noteElementModule.noteDeliberation;
        newNotElementModule.noteNormale = noteElementModule.noteNormale;
        newNotElementModule.noteRatt = noteElementModule.noteRatt;
        newNotElementModule.id = noteElementModule.id;
        newNotElementModule.is_ratt = noteElementModule.is_ratt;
        newNotElementModule.noteModule = <NoteModule> {
          id: noteElementModule.noteModule.id
        };

        toUpdateNoteElementModules.push(newNotElementModule);
      }
    }
    console.log(toUpdateNoteElementModules);
    this.httpClient.put(this.common.url + '/putNoteModules', toUpdateNoteElementModules).subscribe(value => {
      for (let noteElementModule of updatedNoteElementModules) {
        noteElementModule['selected'] = false;
      }
      this.selectAll = false;
      this.common.qToastMessage(MessageType.UPDATE, true);
    }, error => {
      console.log(error);
      this.common.qToastMessage(MessageType.UPDATE, false);
    });
  }


  onToggleUpdateStudent($event: MatSlideToggleChange, etudiant: Etudiant) {
    console.log(etudiant['selected']);
  }

  ontoggleAll($event: MatSlideToggleChange) {
    this.selectAll = $event.checked;
    for (const etudiant of this.etudiantsList) {
      if (etudiant['is_dropped']) {
        continue;
      }
      for (const noteElementModule of etudiant.noteModule.noteElementModules) {
        noteElementModule['selected'] = $event.checked;
      }
    }
  }

  onToggleRatt($event: MatSlideToggleChange, noteElementModule: NoteElementModule) {
    noteElementModule.is_ratt = $event.checked;
  }
}
