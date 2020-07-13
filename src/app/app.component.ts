import {Component, OnInit} from '@angular/core';
import {EtudiantServiceService} from './services/etudiant-service.service';
import {DemandeRelevesComponent} from './etudiant/demande-releves/demande-releves.component';
import {AuthService} from './services/auth.service';
import {SidebarService} from './services/sidebar.service';
import {UserService} from './services/user.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FrontEnd';

  constructor(public userService:UserService,public sidebarservice: SidebarService, public authService: AuthService, public etudiantService: EtudiantServiceService) {
  }

  ngOnInit(): void {
    if (this.authService.isStudent) {
      this.etudiantService.initData();
    }
    if(!this.authService.isAdmin){
      this.userService.initData();
    }
    this.sidebarservice.setMenuByUser();
  }
  async initData(){
    if (this.authService.isStudent) {
     await this.etudiantService.initData();
    }
    if(!this.authService.isAdmin){
      await this.userService.initData();
    }
    this.sidebarservice.setMenuByUser();
  }
  toggleSidebar($event:MouseEvent) {
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
}
