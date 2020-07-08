import {Injectable, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonService} from './common.service';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Etudiant} from '../entities/entities';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit {
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isStudent: boolean = false;
  isProfessor: boolean = false;
  student: Etudiant;
  isNotInHome = false;
  role:string;
  constructor(private location: Location, public router: Router, private httpClient: HttpClient, private common: CommonService) {
  }

  ngOnInit(): void {

  }

  login() {
    this.router.navigateByUrl('/login');
  }

  logout() {
    this.isAuthenticated = false;
    this.isAdmin = this.isStudent = this.isProfessor = false;
    this.role = '';
    this.login();
  }

  authentication(isInHome:boolean,role:string):void {
    this.isNotInHome = !isInHome;
    if (this.isAuthenticated) {
      if(this.role != role){
        this.router.navigateByUrl('/');
        this.common.toastMessage('Error','Unauthorized Access');
      }
      return;
      // if(isInHome)
      // this.router.navigateByUrl('/');
      // else this.location.back();
      // return;
    }
    this.login();
  }
   authenticationByRole(role:string):void {
    if (this.isAuthenticated) {
      if(this.role != role){
        this.router.navigateByUrl('/');
        this.common.toastMessage('Error','Unauthorized Access');
      }
        return;
    }
    this.login();
  }

  authenticate(username, password, role) {
    switch (role) {
      case 'admin':
        if (username == 'admin' && password == 'admin') {
          this.isAdmin = true;
          this.isAuthenticated = true;
          this.router.navigateByUrl('/');
          this.role='admin';
        }
        break;
      case 'student':
        let etudiant = new Etudiant();
        etudiant.email = username;
        etudiant.password = password;
        this.httpClient.post(this.common.url + '/loginStudent',etudiant).subscribe(etudiant => {
          console.log(etudiant);
          role='student';
          if(etudiant != null){
            this.isAuthenticated = true;
            this.isStudent = true;
            this.student = <Etudiant> etudiant;
            this.router.navigateByUrl('/');
          }



        });


        break;
      case 'professor':
        break;
    }
    return false;
  }

}
