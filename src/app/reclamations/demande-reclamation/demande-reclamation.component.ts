import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {AuthService} from '../../services/auth.service';
declare var $:any;
@Component({
  selector: 'app-demande-reclamation',
  templateUrl: './demande-reclamation.component.html',
  styleUrls: ['./demande-reclamation.component.css']
})
export class DemandeReclamationComponent implements OnInit {
  libelle: string = "";
  description: string = "";

  constructor(public httpClient:HttpClient,public common:CommonService,public authService:AuthService) { }

  ngOnInit(): void {

  }

  onSubmit(value: any) {
    if(this.libelle == ""  ||  this.description == ""){
      this.common.toastMessage('','Remplir les champs avant de soumettre.')
      return;
    }
    let reclamation = {
      libelle:this.libelle,
      detail:this.description,
      user:{
        id:this.authService.user.id
      }
    }
    this.httpClient.post(this.common.url + '/saveReclamation',reclamation).subscribe(value1 => {
        this.common.toastMessage('Success','Votre Réclamation a été envoyé.');
        $('.reclamation-modal').modal('hide');
    },error => {
        this.common.toastMessage('Erreur','Une erreur a empeché l\'enregistrement de votre réclamation.');
      console.log(error);
    })
  }
}
