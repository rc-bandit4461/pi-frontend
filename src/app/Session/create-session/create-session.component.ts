import {Component, OnInit} from '@angular/core';
import {Element, Etudiant, Filiere, Module, SemestreFiliere, Session} from '../../entities/entities';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {Router} from '@angular/router';
import {element} from 'protractor';
import {ToastrService} from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css']
})
export class CreateSessionComponent implements OnInit {
  public filieresList: Filiere[];
  public toCreateSession: Session;
  searchCin: any = '';
  currentStudents: Etudiant[] = [];

  public searchedStudent: Etudiant;
  public isLoaded: boolean = false;
  public isError: boolean = false;
  selectedOption: any;

  constructor(private toastr: ToastrService
,private httpClient: HttpClient, private common: CommonService, private router: Router) {
  }

  ngOnInit(): void {
    this.toCreateSession = new Session();
    this.toCreateSession.filiere = new Filiere();
    this.getFilieres();
  }

  removeDuplicates() {
    this.currentStudents = this.currentStudents.filter((v, i, a) => a.indexOf(v) == i);
  }

  async getFilieres() {
    try {
      let data = await this.httpClient.get<Filiere>(this.common.url + '/filieres  ').toPromise();
      this.filieresList = data['_embedded']['filieres'];
      if (this.filieresList.length == 0) {
        return;
      }
      this.toCreateSession.filiere = this.filieresList[0];
      this.selectedOption = this.toCreateSession.filiere.id;
      for (const filiere of this.filieresList) {
        let data: Object = await this.httpClient.get(filiere._links['semestreFilieres']['href']).toPromise();
        filiere.semestreFilieres = data['_embedded']['semestreFilieres'];
        for (const semestreFiliere of filiere.semestreFilieres) {
          data = <Module[]> <unknown> await this.httpClient.get<Module[]>(semestreFiliere._links['modules']['href']).toPromise();
          semestreFiliere.modules = <Module[]> data['_embedded']['modules'];
          for (const module of semestreFiliere.modules) {
            module.facteur = 1;
            data = <Element> await this.httpClient.get(module._links['elements']['href']).toPromise();
            module.elements = data['_embedded']['elements'];
            for (const element of module.elements) {
              element.facteur = 1;
            }
          }
        }
      }
      this.isLoaded = true;
      console.log(this.filieresList);
    } catch (e) {
      this.isError = true;
      this.toastr.error( 'Une erreur s\'est commise lors du chargement des ressources');
      console.log(e);
    }

  }

  onSubmit(value: any, selected: MatListOption[]) {

    console.log(this.currentStudents);
    let selectedStudents = [];
    selected.forEach(selectedItem => {
      selectedStudents.push(selectedItem['value']);
    });
    console.log(selectedStudents);
    this.toCreateSession['etudiants'] = selectedStudents;
    console.log(this.toCreateSession);
    if (selected.length == 0) {
      this.toastr.error( 'Inserer au moins un etudiant');
      return;
    }
    if (!this.toCreateSession.filiere?.id) {
      this.toastr.error( 'Choisissez une filiere');
      return;
    }
    this.httpClient.post(this.common.url + '/saveSession', this.toCreateSession).subscribe(data => {
      this.toastr.success('Session crée');
        this.router.navigateByUrl('/admin/sessions');


    }, error => {

      this.toastr.error( 'Une erreur est survenue lors de l\'insertion de la session');
      console.log(error);
    });

  }

  onFiliereSelectChange($event: Event) {
    console.log(this.selectedOption);
    console.log($event);
    for (const filiere of this.filieresList) {
      if (this.selectedOption == filiere.id) {
        this.toCreateSession.filiere = filiere;
        break;
      }
    }
    console.log(this.toCreateSession.filiere.id);
    // this.httpClient.get(this.toCreateSession.filiere.id).toPromise();
  }

  onSearchCin($event: Event) {
    if (!this.searchCin) {
      this.toastr.warning( 'Inserer un CIN dabord');
      return;
    }
    console.log(this.searchCin);
    this.httpClient.get(this.common.url + '/etudiants/search/byCin?var=' + this.searchCin.toUpperCase()).subscribe(value => {
      if (value['_embedded']['etudiants']?.length > 0) {
        this.searchedStudent = value['_embedded']['etudiants'][0];
        let index = this.currentStudents.findIndex(student => student.id == this.searchedStudent.id);
        if (index == -1) {
          this.currentStudents.push(this.searchedStudent);
        } else {
          this.toastr.warning( 'Cet etudiant est deja dans la liste');

        }

      } else {
        this.toastr.warning( 'Aucun etudiant correspond à cette CIN');
      }

    });

  }

  studentSelectionChange(selected: MatListOption[]) {
    console.log(selected);
    console.log(this.currentStudents);
  }

  onChangeStudent($event: Event) {
    console.log(event);
  }

  toggleShowSemestre(semestreFiliere: SemestreFiliere) {
    if (!semestreFiliere['show']) {
      semestreFiliere['show'] = true;
    } else {
      semestreFiliere['show'] = false;
    }

  }
}
