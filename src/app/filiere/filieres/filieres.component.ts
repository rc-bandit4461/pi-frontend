import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {Filiere} from '../../entities/entities';
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
  currentPage: Boolean;

  constructor(private httpClient: HttpClient, private common: CommonService, private router: Router) {
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.httpClient.get<Filiere>(this.common.url + '/filieres').subscribe(
      data => {
        this.filieresList = data['_embedded'].filieres;
      },
      error => {
        this.common.toastMessage('Error', 'Erreur lors de l\'importation des filieres');
        console.log(error);
      }, () => {
        console.log('fetching filieres completed');
      }
    );
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
