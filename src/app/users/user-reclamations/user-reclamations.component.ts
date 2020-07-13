import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Reclamation} from '../../entities/entities';
import {AuthService} from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-user-reclamations',
  templateUrl: './user-reclamations.component.html',
  styleUrls: ['./user-reclamations.component.css']
})
export class UserReclamationsComponent implements OnInit {
reclamations: Reclamation[] = [];
  public isLoaded: boolean = false;
  public isError: boolean = false;

  constructor(public userService:UserService,public authService:AuthService, public httpClient: HttpClient, public common: CommonService) {
  }

  ngOnInit(): void {
    console.log('CALLED');
    this.getData();
    $('.userReclamationModal').on('hidden.bs.modal', _ => {
      this.userService.showUserReclmationModal = false;

    });

  }

  show() {
  }

  public async getData() {
    try {

      let data = await this.httpClient.get(this.common.url + '/reclamations/search/byUserNotSeen?idUser=' + this.authService.user.id).toPromise();
      this.reclamations = <Reclamation[]> data['_embedded']['reclamations'];
      this.isLoaded = true;
      $('.userReclamationModal').modal('toggle');

    } catch (e) {
      console.log(e);
      this.isError = true;
      $('.userReclamationModal').modal('toggle');
    }
  }

  onClearRequest(demande: Reclamation) {
    this.httpClient.get(this.common.url + '/makeReclamationSeen/' + demande.id).subscribe(value => {
      demande.seen = true;
      this.userService.reclamationsCount--;
    }, error => {
      this.common.toastMessage('Erreur', 'Une erreure a empeché la mise a jour des données ');
      console.log(error);

    });
  }

}
