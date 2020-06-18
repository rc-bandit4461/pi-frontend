import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {Filiere, Session} from '../../entities/entities';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  public sessionsList:Session[] = [];
  public isLoaded:boolean = false;
  public isError: boolean=false;
  constructor(private httpClient:HttpClient,private common:CommonService) { }

  ngOnInit(): void {
      this.loadSessions();
  }
  async loadSessions() {
    try {
    let data = await this.httpClient.get(this.common.url + '/sessions').toPromise();
      if(data['_embedded']['sessions'].length == 0) return;
      this.sessionsList = data['_embedded']['sessions'];
      for (const session of this.sessionsList) {
        session.filiere = await this.httpClient.get<Filiere>(session._links['filiere'].href).toPromise();
    this.isLoaded = true;
      }

    }catch (e) {
        this.isError = true;
        console.log(e);
    }
  }


  onDeleteSession(session: Session) {
        if(!confirm("Etes vous sure de vouloir supprimer"))return;
        this.httpClient.delete(session._links.self.href).subscribe(value => {
            this.common.toastMessage('Success,','Session supprimé');
            this.sessionsList.splice(this.sessionsList.indexOf(session),1);
            },error => {
            this.common.toastMessage('Erreur,','Une erreur est rencontré lors de la procédure de suppression');
            console.log(error);

          }
          )
  }
}
