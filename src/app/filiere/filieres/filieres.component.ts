import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {Diplome, Filiere} from '../../entities/entities';
import {Router} from '@angular/router';
import {toBase64String} from '@angular/compiler/src/output/source_map';

@Component({
  selector: 'app-filieres',
  templateUrl: './filieres.component.html',
  styleUrls: ['./filieres.component.css']
})
export class FilieresComponent implements OnInit {
  filieresList: Filiere[];
  pagesArray: any;
  isLoaded: boolean = false;
  isError: boolean = false;
  currentPage: Boolean;

  constructor(private httpClient: HttpClient, private common: CommonService, private router: Router) {
  }

  ngOnInit() {
    this.getList();
  }

  async getList() {
    try {
      let data = await this.httpClient.get<Filiere>(this.common.url + '/filieres').toPromise();
    this.filieresList = data['_embedded'].filieres;
    for (const filiere of this.filieresList) {
      filiere.diplome = <Diplome>  await this.httpClient.get(filiere._links['diplome']['href']).toPromise();
    }
    this.isLoaded = true;
    }catch (e) {
      this.isError = true;
    this.common.toastMessage(this.common.messages.error.title, this.common.messages.error.message.get);

    }

  }

  onDelete(filiere: Filiere) {
    if (!confirm('Etes vous sure de vouloir supprimer ')) {
      return;
    }
    console.log('deletion of ');
    console.log(filiere);
    this.httpClient.delete(this.common.url + '/filieres/' + filiere.id).subscribe(value => {
      this.common.toastMessage('Success', 'Suppression réussite.');
      this.getList();

    }, error => {
      this.common.toastMessage('Error', 'Une erreur s\'est produite lors de l\'opération de suppresison');

    });
  }

  onEdit(filiere: Filiere) {
    this.router.navigateByUrl('/admin/filieres/edit/' + btoa(filiere._links.self.href));
    console.log('Editind of ');
    console.log(filiere);

  }
}
