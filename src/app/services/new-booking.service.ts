import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../Models/Booking';

@Injectable({
  providedIn: 'root',
})
export class NewBookingService {
  constructor(private http: HttpClient) {}
  host = 'http://localhost:8080/api/';

  saveBooking(booking: Booking): Observable<any> {
    return this.http.post(this.host + 'booking/add', booking);
  }
  public getRooms() {
    return this.http.get(this.host + '/rooms');
  }
  public getUsers() {
    return this.http.get(this.host + '/users');
  }
}
