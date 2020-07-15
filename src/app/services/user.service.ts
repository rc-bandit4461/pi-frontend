import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Etudiant} from '../entities/entities';
import {CommonService} from './common.service';
import {AuthService} from './auth.service';
import {ServerService} from './server.service';
@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit{
  showUserReclmationModal: boolean;
  reclamationsCount: number = 0;

  constructor(public httpClient: HttpClient, public common: CommonService,public authService:AuthService,public server:ServerService) {
  }
    public async initData() {
    try {
      if(this.authService.isLoggedIn())
      this.reclamationsCount = await this.httpClient.get<number>(this.common.url + '/reclamations/search/countNotSeen?idUser=' + this.authService.user.id).toPromise();

    } catch (e) {
      console.log(e);
    }
  }

  ngOnInit(): void {
    this.initData();
  }

  }
