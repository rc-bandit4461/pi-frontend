import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {element} from 'protractor';

import * as $ from 'jquery';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Router} from '@angular/router';
import {Diplome} from '../../entities/entities';
import {AuthenticationService} from '../../services/authentication.service';

declare var SelectPure: any;

@Component({
  selector: 'app-create-filiere',
  templateUrl: './create-filiere.component.html',
  styleUrls: ['./create-filiere.component.css']
})
export class CreateFiliereComponent implements OnInit {

  public elementsSelectList: any[] = [];
  public elementsSelect: any;
  public currentModule: string = '';
  public selectedValues: any[] = [];
  public modules: any[] = [];
  public module_id: number = 0;
  public semestresCount: number = 1;
  public previousSemestreCount: number = this.semestresCount;
  public semestresList: any[] = [];
  public libeleFiliere: any = '';
  public filiere: any;
  isError: boolean = false;

  public diplomesList: Diplome[] = [];
  descriptionFiliere: string = '';
  filiereDiplome: Diplome = new Diplome();
  isLoaded: boolean = false;

  constructor(public auth:AuthenticationService,private router: Router, private httpClient: HttpClient, private  common: CommonService) {
  }

  initializeSemestresList() {
    this.semestresList = [];
    for (let i = 1; i <= this.semestresCount; i++) {
      this.semestresList.push({id: i, modules: []});
    }
  }

  ngOnInit(): void {
    this.auth.authentication(false,'admin');
    this.initializeSemestresList();
    this.loadData();

  }

  async loadData() {
    await this.generateElements();
    await this.getDiplomes();
    this.isLoaded = true;
  }

  creatElementsSelect(array: any[]) {
    this.elementsSelect = new SelectPure('.elements-select', {
      options: array,
      multiple: true,
      autocomplete: true,
      icon: 'fa fa-times',
      onChange: value => {
        this.selectedValues = value;
      },
      classNames: {
        select: 'select-pure__select',
        dropdownShown: 'select-pure__select--opened',
        multiselect: 'select-pure__select--multiple',
        label: 'select-pure__label',
        placeholder: 'select-pure__placeholder',
        dropdown: 'select-pure__options',
        option: 'select-pure__option',
        autocompleteInput: 'select-pure__autocomplete',
        selectedLabel: 'select-pure__selected-label',
        selectedOption: 'select-pure__option--selected',
        placeholderHidden: 'select-pure__placeholder--hidden',
        optionHidden: 'select-pure__option--hidden',
      }
    });
  }

  generateElements() {
    this.httpClient.get(this.common.url + '/elements').subscribe(
      value => {
        console.log(value['_embedded']);
        value['_embedded']['elements'].forEach(element => {
          this.elementsSelectList.push({
            label: element.libelle + '',
            value: element.id + ''
          });
        });
        this.creatElementsSelect(this.elementsSelectList);
        ;

      }, error => {

        this.isError = true;
      }
    );
  }


  removeElement(str: any[]) {
    for (let j = 0; j < str.length; j++) {
      for (let i = 0; i < this.elementsSelectList.length; i++) {
        if (this.elementsSelectList[i].value == str[j]) {
          this.elementsSelectList.splice(i, 1);
          break;
        }
      }
    }
  }

  removeModuleById(list: any[], id) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        list.splice(i, 1);
        break;
      }
    }
  }

  //enables or disables elements in the elements list, we pass an array of element ids
  filiereDiplomeId: string = '';

  alterSelectElements(str: string[], bool: boolean) {
    for (let j = 0; j < str.length; j++) {
      for (let i = 0; i < this.elementsSelectList.length; i++) {
        if (this.elementsSelectList[i].value == str[j]) {
          this.elementsSelectList[i].disabled = bool;
          break;
        }
      }
    }
  }

  onDeleteModule(motherList, id: number) {
    // $('#' + id).remove();
    let moduleToRemove = this.getModule(id);
    this.removeModuleById(motherList, moduleToRemove.id);
    this.alterSelectElements(moduleToRemove.elements, false);
    this.removeElement([id]);
    $('.elements-select').html('');
    this.creatElementsSelect(this.elementsSelectList);


  }

  getModule(id) {
    for (let i = 0; i < this.modules.length; i++) {
      if (this.modules[i].id == id) {
        return this.modules[i];
      }
    }
  }

  onAddModule() {
    if (!this.currentModule || this.selectedValues?.length == 0) {
      return;
    }
    console.log('Module ' + this.currentModule);
    console.log('elements-->');
    console.log(this.selectedValues);
    this.modules.push({id: this.module_id, libelle: this.currentModule, elements: this.selectedValues});
    // $('<button class="list-group-item list-group-item-action" type="button" [id]="module_id"' +
    //   ' (dblclick)="this.onDeleteModule(module_id)"' +
    //   ' >' + this.currentModule + '</button>').appendTo('#modules-list');
    this.alterSelectElements(this.selectedValues, true);
    this.currentModule = '';
    this.selectedValues = [];
    this.elementsSelect.reset();
    $('.elements-select').html('');
    this.creatElementsSelect(this.elementsSelectList);
    this.module_id++;
  }


  onSemstreCountChange() {
    //getting current semestres count that have at least 1 module in them
    if (this.previousSemestreCount < this.semestresCount) {
      this.previousSemestreCount = this.semestresCount;
      this.semestresList.push({
        id: this.semestresCount,
        modules: []

      });
      return;
    }

    if (this.semestresList[this.semestresList.length - 1].modules.length > 0) {
      this.common.toastMessage('Error', 'Supprimez dabord les modules depuis le dernier semestre');
      this.semestresCount = this.semestresList.length;

    } else {
      this.semestresList.pop();
      this.previousSemestreCount = this.semestresCount;
    }

  }

  dropOnSemestre(event: CdkDragDrop<string[]>, semestre: any) {
    console.log('dragOnSemestre');
    console.log(event);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    console.log('Semestre  ' + semestre.id);
    console.log(semestre.modules);
  }

  dropOnModule(event: CdkDragDrop<string[]>) {
    console.log('dragOnModule');
    console.log(event);
    // console.log(event.container == event.previousContainer);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    console.log('modulesList');
    console.log(this.modules);
    console.log(this.semestresList);
  }

  existsEmptySemester() {
    console.log(this.semestresList);
    for (const smeestre of this.semestresList) {
      if (smeestre.modules.length == 0) {
        return true;
      }
    }
    return false;
  }


  onSubmit(value: any) {

    if (this.existsEmptySemester()) {
      this.common.toastMessage('Erreur', 'Remplissez les semestres vides');
      return;
    }
    if (!this.libeleFiliere) {
      this.common.toastMessage('Erreur', 'Il existe des champs manquants');
      return;
    }
    // console.log(this.filiere);
    console.log(this.diplomesList);
    this.filiere = {};
    this.filiere['libelle'] = this.libeleFiliere;
    this.filiere['nbr_semestres'] = this.semestresCount;
    this.filiere['semestreFilieres'] = [];
    for (let diplome of this.diplomesList) {
      if (this.filiereDiplomeId == diplome.id + '') {
        this.filiere.diplome = diplome;
      }
    }
    this.filiere.description = this.descriptionFiliere;
    console.log(value);
    console.log(this.filiereDiplome);
    ;
    this.semestresList.forEach(semestre => {
      let currentSemestre = {modules: []};

      semestre.modules.forEach(mod => {
        console.log(mod);
        let currentMod = {libelle: mod.libelle};
        let currentElements = [];
        mod.elements.forEach(element => {
          currentElements.push({
            id: element
          });
        });
        currentMod['elements'] = currentElements;
        currentSemestre.modules.push(currentMod);
      });

      this.filiere['semestreFilieres'].push(currentSemestre);
    });
    console.log(this.filiere);


    this.httpClient.post(`${this.common.url}/saveFiliere`, this.filiere).subscribe(value1 => {
      this.common.toastMessage('Success', 'Filiere ajoutée.');
      this.router.navigateByUrl('/admin/filieres');
    }, error => {
      this.common.toastMessage('Error', 'Une erreur s\'est produite lors de l\'ajout.');
      console.log(error);
    });
    //Insertion des modules tout d'abord?

  }

  private getDiplomes() {
    this.httpClient.get(this.common.url + '/diplomes').subscribe(value => {
      this.diplomesList = value['_embedded']['diplomes'];
    }, error => {
      console.log(error);
      this.isError = true;
    });
  }

  onSelectDiplomeChange($event: Diplome) {
    console.log($event);
  }
}
