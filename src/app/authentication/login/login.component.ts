import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = "";
  password: string = "";
  isAdmin: boolean = false;
  isProfessor: boolean = false;
  isStudent: boolean = false;
  isFalseCredentials:boolean = false;
  constructor(public router:Router,private auth:AuthenticationService) { }

  ngOnInit(): void {
  }

  onSubmitLogin(value: any) {
    this.isFalseCredentials = false;
    console.log(this.router.url);

    console.log(value);
    if(value.isAdmin){
      this.auth.authenticate(value.username,value.password,"admin");
    }
    else if(value.isProfessor){
      this.auth.authenticate(value.username,value.password,"professor");
    }
    else {
      this.auth.authenticate(value.username,value.password,"student");
    }
    this.isFalseCredentials = true;
  }

  onChandeUserRole($event: Event) {
    console.log($event);
  }
}
