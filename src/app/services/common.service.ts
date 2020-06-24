import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
export enum MessageType{
    UPDATE,
  DELETE,
  CREATE,
  GET
}
declare var $: any;


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public url: string = 'http://localhost:8080';
  public messages = {
    error: {
      title:'Erreur',
      message : {
      get: 'Une erreur rencontré lors de chargement des données',
      update: 'Une erreur rencontré lors de la procedure de mise a jour',
      delete: 'Une erreur rencontré lors de la procedure de suppression',
      create: 'Une erreur rencontré lors de la procedure d\'ajout',

      }
    },
    success: {
      title:'Success',
      message:{
      get: 'Opération de chargement réuissite',
      update: 'Operation de mise a jour réussite',
      delete: 'Operation de suppression réussite',
      create: 'Operation de création réussite',
      }
    }
  };

  constructor(private httpClient: HttpClient) {
  }
  public qToastMessage(type:MessageType,bool:boolean){
      if(type == MessageType.CREATE){
        if(bool == true)
          this.toastMessage(this.messages.success.title,this.messages.success.message.create);
        else
          this.toastMessage(this.messages.error.title,this.messages.error.message.create);
      }
      else if(type == MessageType.UPDATE){
        if(bool == true)
          this.toastMessage(this.messages.success.title,this.messages.success.message.update);
        else
          this.toastMessage(this.messages.error.title,this.messages.error.message.update);
      }
      if(type == MessageType.DELETE){
        if(bool == true)
          this.toastMessage(this.messages.success.title,this.messages.success.message.delete);
        else
          this.toastMessage(this.messages.error.title,this.messages.error.message.delete);
      }
      if(type == MessageType.GET){
        if(bool == true)
          this.toastMessage(this.messages.success.title,this.messages.success.message.get);
        else
          this.toastMessage(this.messages.error.title,this.messages.error.message.get);
      }
  }
  public getPagesArray(noPages: number) {
    let array = [];
    for (let i = 0; i < noPages; i++) {
      array.push(i);
    }
    return array;
  }

  public deleteResource<T>(url: string) {
    return this.httpClient.delete<T>(this.url);
  }

  public createResource<T>(url: string, data): Observable<T> {
    return this.httpClient.post<T>(this.url, data);
  }

  public getResource<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(url);
  }

  public updateResource<T>(url, data): Observable<T> {
    return this.httpClient.put<T>(url, data);
  }

  public toastMessage(title, message: string) {

    $('<div class="toast" role="alert" aria-live="assertive" aria-atomic="true"> <div class="toast-header"> <strong class="mr-auto">' + title + '</strong> <small class="text-muted"></small> <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> </div> <div class="toast-body">' + message + '</div> </div>').appendTo('#toasts-div').toast({autohide: false}).toast('show',{animation:true,
      delay:5000

    }).delay(5000).slideUp(
    );
  }
}
