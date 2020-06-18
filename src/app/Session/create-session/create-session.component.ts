import {Component, OnInit} from '@angular/core';
import {Etudiant, Filiere, Session} from '../../entities/entities';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {Router} from '@angular/router';

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

  private searchedStudent: Etudiant;

  constructor(private httpClient: HttpClient, private common: CommonService,private router:Router) {
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
    } catch (e) {
      this.common.toastMessage('Erreur', 'Une erreur s\'est commise lors du chargement des ressources');
      console.log(e);
    }

  }

  onSubmit(value: any, selected: MatListOption[]) {
    console.log(this.currentStudents);
    let selectedStudents = [];
    selected.forEach(selectedItem => {
      selectedStudents.push(selectedItem['value']);
    })
    console.log(selectedStudents);
    console.log(this.toCreateSession);
    this.toCreateSession['etudiants'] = selectedStudents;
      if(selected.length == 0 ){
        this.common.toastMessage('Erreur','Inserer au moins un etudiant');
        return;
      }
      if(!this.toCreateSession.filiere?.id){
        this.common.toastMessage('Erreur','Choisissez une filiere');
        return;
      }
      this.httpClient.post(this.common.url + '/saveSession',this.toCreateSession).subscribe(value1 => {
          this.common.toastMessage('Success','Session crée');
          this.router.navigateByUrl('/admin/sessions');

      },error => {

          this.common.toastMessage('Erreur','Une erreur est survenue lors de l\'insertion de la session');
          console.log(error);
      })

  }

  onFiliereSelectChange($event: Event) {
    console.log(this.toCreateSession.filiere.id);
  }

  onSearchCin($event: Event) {
    if (!this.searchCin) {
      this.common.toastMessage('Erreur', 'Inserer un CIN dabord');
      return;
    }
    console.log(this.searchCin);
    this.httpClient.get(this.common.url + '/etudiants/search/byCin?var=' + this.searchCin.toUpperCase()).subscribe(value => {
      if (value['_embedded']['etudiants']?.length > 0) {
        this.searchedStudent = value['_embedded']['etudiants'][0];
        let index = this.currentStudents.findIndex(student => student.id == this.searchedStudent.id);
        if(index == -1)
        this.currentStudents.push(this.searchedStudent);
        else {
        this.common.toastMessage('Info', 'Cet etudiant est deja dans la liste');

        }

      } else {
        this.common.toastMessage('Info', 'Aucun etudiant correspond à cette CIN');
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
}
