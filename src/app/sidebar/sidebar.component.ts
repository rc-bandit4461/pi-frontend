import {Component, OnInit} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {SidebarService} from '../services/sidebar.service';
import {AuthService} from '../services/auth.service';
import {$e} from 'codelyzer/angular/styles/chars';
import {EtudiantServiceService} from '../services/etudiant-service.service';
import {CommonService} from '../services/common.service';
import {UserService} from '../services/user.service';

// import { MenusService } from './menus.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('slide', [
      state('up', style({height: 0})),
      state('down', style({height: '*'})),
      transition('up <=> down', animate(200))
    ])
  ]
})
export class SidebarComponent implements OnInit {
  menus = [];
  isToggled = false;
  animationState = [];
  subTitle;
  crumb = [];
  constructor(public userService: UserService, public common: CommonService, public sidebarservice: SidebarService, public authService: AuthService, public etudiantService: EtudiantServiceService) {

  }

  ngOnInit() {
    // this.sidebarservice.setMenuByUser();
    this.menus = this.sidebarservice.getMenuList();
  }

  getSideBarState() {
    return this.sidebarservice.getSidebarState();
  }

  toggle(currentMenu, $event?: MouseEvent,) {
    if ($event) {
      $event.preventDefault();
    }
    if (currentMenu.type === 'dropdown') {
      this.menus.forEach(element => {
        if (element === currentMenu) {
          currentMenu.active = !currentMenu.active;
        } else {
          element.active = false;
        }
      });
    }
  }

  getState(currentMenu) {

    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }
 toggleShowDiv(index) {
    this.animationState[index] = this.animationState[index] === 'out' ? 'in' : 'out';
    return false;
  }
  hasBackgroundImage() {
    return this.sidebarservice.hasBackgroundImage;
  }

  logout($event: MouseEvent) {
    $event.preventDefault();
    this.authService.logout();
    this.sidebarservice.setMenuByUser();
  }
}
