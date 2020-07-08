import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-create-element',
  templateUrl: './create-element.component.html',
  styleUrls: ['./create-element.component.css']
})
export class CreateElementComponent implements OnInit {

  constructor(public auth:AuthenticationService) { }

  ngOnInit(): void {
    this.auth.authentication(false,'admin');

  }

}
