import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../services/common.service';
import {element} from 'protractor';

import * as $ from 'jquery';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ActivatedRoute, Router} from '@angular/router';
import {Filiere, Module, SemestreFiliere} from '../../entities/entities';
import {forEachComment} from 'tslint';

declare var SelectPure: any;

@Component({
  selector: 'app-edit-filiere',
  templateUrl: './edit-filiere.component.html',
  styleUrls: ['./edit-filiere.component.css']
})
export class EditFiliereComponent implements OnInit {

  public elementsSelectList: any[] = [];
  public elementsSelect: any;  //<select></select>
  public currentModule: string = '';
  public selectedElements: any[] = [];
  public modules: any[] = [];
  public module_id: number = 0;
  public semestresCount: number = 1;
  public previousSemestreCount: number = this.semestresCount;
  public semestresList: any[] = [];
  public libelleFiliere: any = '';
  public filiere: any;
  public isLoaded:boolean = false;
  public errorOccured:boolean = false;
  constructor(private router: Router, private httpClient: HttpClient, private  common: CommonService, private activatedRoute: ActivatedRoute) {
  }



  async loadData() {
    this.semestresList = [];
    let data;
    let filiere;
    let semestres: any[];
    let modules: any[];
    let elements: any[];
    let url = atob(this.activatedRoute.snapshot.params.url);
    try {
      filiere = await this.httpClient.get<Filiere>(url).toPromise();
      console.log(filiere);
      this.filiere = filiere;
      this.libelleFiliere = filiere.libelle;
      console.log(filiere._links.semestreFilieres.href);
      data = await this.httpClient.get(filiere._links.semestreFilieres.href).toPromise();
      console.log(data);
      semestres = data['_embedded']['semestreFilieres'];
      this.semestresCount = semestres.length;
      for (const semestre of semestres) {
        let semestreToBeAdded = {id: semestre.numero, modules: []};
        data = await this.httpClient.get(semestre._links.modules.href).toPromise();
        console.log(data);
        modules = data['_embedded']['modules'];
        for (const mod of modules) {
          let moduleToBeAdded = {id: this.module_id++, libelle: mod.libelle, elements: []};
          data = await this.httpClient.get(mod._links.elements.href).toPromise();
          console.log(data);
          elements = data['_embedded']['elements'];
          elements.forEach(element => {
            this.selectedElements.push(element.id + '');
            moduleToBeAdded.elements.push(element.id + '');
          });
          semestreToBeAdded.modules.push(moduleToBeAdded);
          // modules.push(moduleToBeAdded);
        }
        this.semestresList.push(semestreToBeAdded);
      }

      await this.generateElements();
      console.log(this.selectedElements);
      this.isLoaded = true;
    } catch (e) {
      this.common.toastMessage('Error', 'une erreur est rencontré lors de chargement des données');
      this.errorOccured = true;
      console.log(e);
    }

  }

  ngOnInit(): void {
    this.loadData();
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

  creatElementsSelect(array: any[]) {
    this.elementsSelect = new SelectPure('.elements-select', {
      options: array,
      multiple: true,
      autocomplete: true,
      icon: 'fa fa-times',
      onChange: value => {
        this.selectedElements = value;
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

  exists(list: any[], id) {
    for (const selected of list) {
      if (selected == id) {
        return true;
      }
    }
    return false;
  }

  async generateElements() {
    this.httpClient.get(this.common.url + '/elements').subscribe(
      value => {
        console.log(value['_embedded']);
        value['_embedded']['elements'].forEach(element => {
          this.elementsSelectList.push({
            label: element.libelle + '',
            value: element.id + '',
            disabled: this.exists(this.selectedElements, element.id + '')

          });
        });
        this.creatElementsSelect(this.elementsSelectList);

        ;

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
    if (!this.currentModule || this.selectedElements?.length == 0) {
      return;
    }
    console.log('Module ' + this.currentModule);
    console.log('elements-->');
    console.log(this.selectedElements);
    this.modules.push({id: this.module_id, libelle: this.currentModule, elements: this.selectedElements});
    this.alterSelectElements(this.selectedElements, true);
    this.currentModule = '';
    this.selectedElements = [];
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


  onSubmit(value: any) {
    console.log('SUBMIT CALLED');
    if(this.existsEmptySemester()){
      this.common.toastMessage('Erreur', 'Remplissez les semestres vides');
      return;
    }
    if (!this.libelleFiliere) {
      this.common.toastMessage('Erreur', 'Il existe des champs manquants');
      return;
    }
    //IL faut Verifier qu'il ya au moins un module dans chaqye semestre
    this.filiere['nbr_semestres'] = this.semestresCount;
    this.filiere['libelle'] = this.libelleFiliere;
    this.filiere['semestreFilieres'] = [];
    console.log(this.filiere);
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


    this.httpClient.put(`${this.common.url}/editFiliere/` + this.filiere.id, this.filiere).subscribe(value1 => {
      this.common.toastMessage('Success', 'Filiere modifié.');
      this.router.navigateByUrl('/admin/filieres');
    }, error => {
      this.common.toastMessage('Error', 'Une erreur s\'est produite lors de l\'ajout.');
      console.log(error);
    });

  }

  onDeleteModuleSemestre(mod: any) {
    this.common.toastMessage('Erreur', 'Deplacer le module depuis le semestre pour pouvoir le supprimer.');
  }
}
