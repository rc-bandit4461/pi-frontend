import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../services/common.service';
import {Element} from '../../entities/entities';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

declare var $: any;

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.css']
})
export class ElementsComponent implements OnInit {
  public elementsList: Element[] = [];
  public currentElement: Element = new Element(null);
  public newElement: Element = new Element(null);
  public pageSize: number = 3;
  public currentPage: number = 0;
  public pagesArray: number[] = [];
  public isAdd: boolean = false;
  public isModify: boolean = false;
  public searchString = '';

  constructor(private toastr:ToastrService,private common: CommonService, private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.getElements();

  }

  getElements() {
    let url;
    if (!this.searchString) {
      url = this.common.url + '/elements?page=' + this.currentPage + '&size=' + this.pageSize;
    } else {
      url = this.common.url + '/elements/search/byLibellePage?mc=' + this.searchString + '&page=' + this.currentPage + '&size=' + this.pageSize;
    }
    this.httpClient.get<Element>(url).subscribe(
      (data: Element) => {
        this.pagesArray = this.common.getPagesArray(data['page'].totalPages);
        this.elementsList = data['_embedded'].elements;

        console.log('Elements Received!');
      }, error => {
        console.log('Error fuck');
      }
    )
    ;
  }

  onSubmit(value: any) {
    if (this.isAdd) {
      this.newElement = new Element(value.libelle);

      console.log(this.newElement);

      this.httpClient.post<Element>(this.common.url + '/listElements', this.newElement).subscribe(
        data => {
          this.toastr.success( 'Added');
          this.newElement = data;
          this.getElements();
        }, error => {
          this.toastr.error( 'Error while saving the element');
          console.log('Error while saving the element');
        }, () => {
          this.isAdd = false;
          $('#element-modal').modal('hide');

        }
      );
    } else {
      this.currentElement.libelle = value.libelle;
      this.toastr.success( 'Modified');
      console.log(this.currentElement);

      this.httpClient.put<Element>(this.currentElement._links.self.href, this.currentElement).subscribe(
        data => {
          this.currentElement = data;
          this.getElements();
        }, error => {
          this.toastr.error( 'Error while saving the element');
          console.log('Error while saving the element');

        }, () => {
          $('#element-modal').modal('hide');
          this.isModify = false;
        }
      );

    }

  }

  onAdd() {
    this.currentElement.libelle = '';
    $('#element-modal').modal('show');
    this.isAdd = true;
  }

  onModify(element: Element) {
    this.currentElement = element;
    $('#element-modal').modal('show');
    this.isModify = true;
  }

  onDelete(element: any) {
    console.log(element);
    if (confirm('Supprimer')) {
      this.httpClient.delete(element._links.self.href).subscribe(
        value => {
          this.toastr.success( 'Element supprimé');
          this.getElements();
        }, error => {

          this.toastr.error( 'Erreur rencontré');
        }
      );
    }
  }

  onPageClick(p: number) {
    this.currentPage = p;
    this.getElements();
  }

  onSearch(value: any) {
    this.searchString = value.libelle;
    this.getElements();
  }
}
