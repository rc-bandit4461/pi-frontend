import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../Models/Room';

@Injectable({
  providedIn: 'root',
})
export class EditRoomService {
  room: any;

  constructor(private http: HttpClient) {}
  host = 'http://localhost:8080/api/room';

  getRoomById(id: number): Observable<any> {
    return this.http.get<Room>(this.host + '/' + id);
  }

  saveRoom(index: number, room: any): Observable<any> {
    return this.http.put(this.host + '/' + index, room);
  }
}
