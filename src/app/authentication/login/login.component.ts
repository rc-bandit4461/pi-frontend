import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Etudiant} from '../../entities/entities';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {AuthService} from '../../services/auth.service';
import {SidebarService} from '../../services/sidebar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  isFalseCredentials: boolean = false;

  constructor(public sidebarService:SidebarService,public authService: AuthService, public router: Router, public common: CommonService, public httpClient: HttpClient) {
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      console.log('ALREADY LOGGED');
      this.router.navigateByUrl('/');

    }
  }

  onSubmitLogin(value: any) {
    this.isFalseCredentials = false;
    // if(this.username=='' || this.password=='') return;
    let result = this.authService.login({
      'userName': this.username,
      'password': this.password
    }).then(value1 => {
      if(!value1){
        this.sidebarService.setMenuByUser();
      }
      this.isFalseCredentials = value1;
    });

  }


}
