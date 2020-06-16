import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  public host: string = 'http://localhost:8080/api';
  constructor(private httpClient: HttpClient) {}

  /**
   * getBookings
   */
  // public getBookings(date: any) {
  //   return this.httpClient.get(this.host + '/booking/' + date);
  // }
  public getBookings() {
    return this.httpClient.get(this.host + '/booking');
  }

  public deleteBooking(id: number) {
    return this.httpClient.delete(this.host + '/deleteBooking/' + id);
  }
}
