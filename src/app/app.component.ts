import {Component, OnInit} from '@angular/core';
import {EtudiantServiceService} from './services/etudiant-service.service';
import {DemandeRelevesComponent} from './etudiant/demande-releves/demande-releves.component';
import {AuthService} from './services/auth.service';
import {SidebarService} from './services/sidebar.service';
import {UserService} from './services/user.service';
import {SlideInOutAnimation} from './animations';
import {CommonService} from './services/common.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [SlideInOutAnimation]
})
export class AppComponent implements OnInit {
  title = 'FrontEnd';
  animationState = [];
  // isToggled: boolean = false;
  subTitle: string = '';

  constructor(public common:CommonService,public userService: UserService, public sidebarservice: SidebarService, public authService: AuthService, public etudiantService: EtudiantServiceService) {
    this.common.isToggled = authService.isLoggedIn();
  }

  ngOnInit(): void {
    if (this.authService.isStudent && this.authService.isLoggedIn()) {
      this.etudiantService.initData();
    }
    if (!this.authService.isAdmin && this.authService.isLoggedIn()) {
      this.userService.initData();
    }
    // this.sidebarservice.setMenuByUser();

    for (let i = 0; i < 30; i++) {
      this.animationState[i] = 'out';
    }
    // this.initData();
  }

  async initData() {
    if (this.authService.isStudent) {
      await this.etudiantService.initData();
    }
    if (!this.authService.isAdmin) {
      await this.userService.initData();
    }
    this.sidebarservice.setMenuByUser();
  }

  toggleSidebar($event: MouseEvent) {
    $event.preventDefault();
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
  }

  toggleBackgroundImage() {
    this.sidebarservice.hasBackgroundImage = !this.sidebarservice.hasBackgroundImage;
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  hideSidebar() {
    this.sidebarservice.setSidebarState(true);
  }

  toggleShowDiv(index) {
    this.animationState[index] = this.animationState[index] === 'out' ? 'in' : 'out';
    return false;
  }

  logout() {
    this.common.isToggled = false;
    this.authService.logout();
  }
}
