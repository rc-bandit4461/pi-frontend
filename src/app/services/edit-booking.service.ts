import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EditBookingService {
  room: any;
  constructor(private http: HttpClient) {}
  host = 'http://localhost:8080/api';

  getBookingById(id: number): Observable<any> {
    return this.http.get<any>(this.host + '/booking/' + id);
  }

  saveBooking(index: number, booking: any): Observable<any> {
    return this.http.put(this.host + '/booking/' + index, booking);
  }
  public getRooms() {
    return this.http.get(this.host + '/rooms');
  }
  public getUsers() {
    return this.http.get(this.host + '/users');
  }
}
