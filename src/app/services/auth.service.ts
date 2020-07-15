import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {ServerService} from './server.service';
import {HttpClient} from '@angular/common/http';
import {CommonService} from './common.service';
import {User} from '../entities/entities';
import {EtudiantServiceService} from './etudiant-service.service';
import {SidebarService} from './sidebar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public loggedIn = new BehaviorSubject<boolean>(false);
  public token: string;
  public user: User;
  public isAdmin = false;
  public isProf = false;
  public isStudent = false;

  isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }

  setUserRole() {
    if (this.user.role == User.ROLE_STUDENT) {
      this.isStudent = true;
      // this.etudiantService.initData();

    }
    if (this.user.role == User.ROLE_PROF) {
      this.isProf = true;
    }
    if (this.user.role == User.ROLE_ADMIN) {
      this.isAdmin = true;
    }
  }

  resetRoles() {
    this.isProf = this.isAdmin = this.isStudent = false;
  }

  constructor(private router: Router, public common: CommonService, public httpClient: HttpClient, private server: ServerService) {
    this.checkIfLoggedInMemory();
  }

  checkIfLoggedInMemory() {
    this.resetRoles();
    console.log('Auth Service');
    const userData = localStorage.getItem('user');
    if (userData) {
      console.log('Logged in from memory');
      const user = JSON.parse(userData);
      this.token = user.token;
      this.user = user.user;
      this.capitalizeName();
      this.setUserRole();
      this.server.setLoggedIn(true, this.token);
      this.loggedIn.next(true);
    }
  }

  capitalizeName() {
    this.user.nom = this.common.capitalize(this.user.nom);
    this.user.prenom = this.common.capitalize(this.user.prenom);
  }

  async login(user) {
    this.resetRoles();
    try {
      let data = await this.httpClient.post(this.common.url + '/authenticate', user).toPromise();
      if (data['token'] != undefined && data['auth'] == true) {
        this.token = <string> data['token'];
        this.user = <User> await this.httpClient.get(this.common.url + '/users/search/byEmail?email=' + user.userName).toPromise();
        this.capitalizeName();
        this.setUserRole();
        this.server.setLoggedIn(true, this.token);
        this.loggedIn.next(true);
        const userData = {
          token: this.token,
          user: this.user,
          auth: true
        };
        localStorage.setItem('user', JSON.stringify(userData));
        return false;
      }

    } catch (e) {
      console.log(e);
      return true;
    }
    return true;
  }

  logout() {
    this.server.setLoggedIn(false);
    delete this.token;
    delete this.user;
    this.resetRoles();
    this.loggedIn.next(false);
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
