import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {Diplome, Filiere} from '../../entities/entities';
import {Router} from '@angular/router';
import {toBase64String} from '@angular/compiler/src/output/source_map';
import {ToastrService} from 'ngx-toastr';

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
  dtOptions: any;

  constructor(private toastr:ToastrService,private httpClient: HttpClient, private common: CommonService, private router: Router) {
  }

  ngOnInit() {
    this.getList();
  }

  async getList() {
    try {
      let data = await this.httpClient.get<Filiere>(this.common.url + '/filieres').toPromise();
      this.filieresList = data['_embedded'].filieres;
      for (const filiere of this.filieresList) {
        filiere.diplome = <Diplome> await this.httpClient.get(filiere._links['diplome']['href']).toPromise();
      }
      this.isLoaded = true;

      this.dtOptions = {
        order: [[0, 'asc']],
        'language': {
          url: 'assets/French.json'
        },

      };
    } catch (e) {
      this.isError = true;
      this.toastr.error('Une erreur s\'est arrivée lors de l\'execution de cette commande.');

    }

  }

  async onDelete(filiere: Filiere) {
    if (!confirm('Etes vous sure de vouloir supprimer ')) {
      return;
    }
    try {
      let data = await this.httpClient.get(filiere._links['sessions']['href']).toPromise();
      if (data['_embedded']['sessions'].length > 0) {
      this.toastr.error('Cette filiere est liée à des sessions.');

        return;
      }
      await this.httpClient.delete(this.common.url + '/filieres/' + filiere.id).toPromise();
      this.toastr.success('\'Opération réussite.');
      this.getList();

    } catch (e) {

      this.toastr.error('Une erreur s\'est arrivée lors de l\'execution de cette commande.');
    }


  }

  onEdit(filiere: Filiere) {
    this.router.navigateByUrl('/admin/filieres/edit/' + btoa(filiere._links.self.href));
    console.log('Editind of ');
    console.log(filiere);

  }
}
