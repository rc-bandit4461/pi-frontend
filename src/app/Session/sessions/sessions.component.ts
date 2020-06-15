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
  constructor(private httpClient:HttpClient,private common:CommonService) { }

  ngOnInit(): void {
      this.loadSessions();
  }
  async loadSessions() {
    let data = await this.httpClient.get(this.common.url + '/sessions').toPromise();
      if(data['_embedded']['sessions'].length == 0) return;
      this.sessionsList = data['_embedded']['sessions'];
      for (const session of this.sessionsList) {
        session.filiere = await this.httpClient.get<Filiere>(session._links['filiere'].href).toPromise();
      }

  }
}
