import { Component,OnInit } from '@angular/core';
import {AuthenticationService} from './services/authentication.service';
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'FrontEnd';
constructor(public auth:AuthenticationService) {
}
 ngOnInit():void {
 }
}
