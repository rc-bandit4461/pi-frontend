import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  public host: string = 'http://localhost:8080/api';
  constructor(private httpClient: HttpClient) {}

  /**
   * getRooms
   */
  public getRooms() {
    return this.httpClient.get(this.host + '/rooms');
  }
  /**
   * deleteRoom
   */
  public deleteRoom(id: number) {
    return this.httpClient.delete(this.host + '/deleteRoom/' + id);
  }
}
