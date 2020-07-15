import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root',
})
export class EditBookingService {
  room: any;
  constructor(private http: HttpClient,private common:CommonService) {}
  host = this.common.url;

  getBookingById(id: number): Observable<any> {
    return this.http.get<any>(this.host + '/bookings/' + id);
  }

  saveBooking(index: number, booking: any): Observable<any> {
    return this.http.put(this.host + '/booking/edit/' + index, booking);
  }
  public getRooms() {
    return this.http.get(this.host + '/rooms');
  }
  public getUsers() {
    return this.http.get(this.host + '/users');
  }
}
