import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-session-edit',
  templateUrl: './session-edit.component.html',
  styleUrls: ['./session-edit.component.css']
})
export class SessionEditComponent implements OnInit {
  constructor(public auth:AuthenticationService) { }

  ngOnInit(): void {
    this.auth.authentication(false,'admin');
  }

}
