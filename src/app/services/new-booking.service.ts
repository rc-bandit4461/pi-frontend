import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../Models/Booking';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root',
})
export class NewBookingService {
  constructor(private http: HttpClient,private common:CommonService) {}
  host = this.common.url

  saveBooking(booking: Booking): Observable<any> {
    return this.http.post(this.host + '/booking/add', booking);
  }
  public getRooms() {
    return this.http.get(this.host + '/rooms');
  }
  public getUsers() {
    return this.http.get(this.host + '/users');
  }
}
