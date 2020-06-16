import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public host: string = 'http://localhost:8080/api';
  constructor(private httpClient: HttpClient) {}

  /**
   * getUsers
   */
  public getUsers() {
    return this.httpClient.get(this.host + '/users');
  }
  /**
   * get User by CIN
   */
  // public getUserbyCIN(key) {
  //   // console.log(currentPage);
  //   return this.httpClient.get(
  //     this.host +
  //       '/produits/search/byDesignationPage?key=' +
  //       key.keyword +
  //       '&page=' +
  //       currentPage +
  //       '&size=' +
  //       size
  //   );
}
