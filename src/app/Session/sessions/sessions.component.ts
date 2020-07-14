import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {Filiere, Session} from '../../entities/entities';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  public sessionsList: Session[] = [];
  public isLoaded: boolean = false;
  public isError: boolean = false;

  constructor(private httpClient: HttpClient, private common: CommonService,private toastr:ToastrService) {
  }

  dtOptions: DataTables.Settings = {};


  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers'
    };
    this.loadSessions();
  }

  async loadSessions() {
    try {
      let data = await this.httpClient.get(this.common.url + '/sessions').toPromise();
      if (data['_embedded']['sessions'].length == 0) {
        return;
      }
      this.sessionsList = data['_embedded']['sessions'];
      for (const session of this.sessionsList) {

        let url = this.common.url + '/sessions/'+session.id +  '/filiere';
        console.log(url);
        session.filiere = await this.httpClient.get<Filiere>(url).toPromise();
      }
      this.dtOptions = {
        order: [[0, 'asc']],
        'language': {
          url: 'assets/French.json'
        },

      };
      this.isLoaded = true;

    } catch (e) {
      this.isError = true;
      console.log(e);
    }
  }


  onDeleteSession(session: Session) {
    if (!confirm('Etes vous sure de vouloir supprimer')) {
      return;
    }
    this.httpClient.delete(session._links.self.href).subscribe(value => {
        this.toastr.success( 'Session supprimé');
        this.sessionsList.splice(this.sessionsList.indexOf(session), 1);
      }, error => {
        this.toastr.error( 'Une erreur est rencontré lors de la procédure de suppression');
        console.log(error);

      }
    );
  }
}
