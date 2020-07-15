import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  public host: string = this.common.url;
  constructor(private httpClient: HttpClient,public common:CommonService) {}

  /**
   * getBookings
   */
  // public getBookings(date: any) {
  //   return this.httpClient.get(this.host + '/booking/' + date);
  // }
  public getBookings() {
    return this.httpClient.get(this.host + '/bookings');
  }

  public deleteBooking(id: number) {
    return this.httpClient.delete(this.host + '/deleteBooking/' + id);
  }
}
