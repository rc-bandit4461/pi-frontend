import { Component,OnInit } from '@angular/core';
import {EtudiantServiceService} from './services/etudiant-service.service';
import {DemandeRelevesComponent} from './etudiant/demande-releves/demande-releves.component';
import {AuthService} from './services/auth.service';
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'FrontEnd';
  constructor(public authService:AuthService,public etudiantService:EtudiantServiceService) {
}
 ngOnInit():void {
    if(this.authService.isStudent){
      this.etudiantService.initData();
    }
 }

}
