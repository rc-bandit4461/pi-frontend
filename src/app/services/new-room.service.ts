import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CommonService} from './common.service';

@Injectable({
  providedIn: 'root',
})
export class NewRoomService {
  constructor(private http: HttpClient, private common:CommonService) {}
  host = this.common.url + '/api/';

  // saveEmployeeUrl = 'save_employee';
  // deleteEmployeeUrl = 'delete_employee/';
  // getEmployeeByIdUrl = 'get_employee_by_id/';
  // updateEmployeeUrl = 'update_employee/';

  // getEmployeeById(id: number): Observable<Employees>
  // {
  //   return this.http.get<Employees>(this.employeeUrl + this.getEmployeeByIdUrl + id);
  // }

  saveRoom(room: any): Observable<any> {
    return this.http.post(this.host + 'room/add', room);
    /* return this.http.post<Employees>(this.employeeUrl, employee); */
  }

  // deleteEmloyee(id: number): Observable<any>
  // {
  //   return this.http.delete<any>(this.employeeUrl + this.deleteEmployeeUrl + id);
  // }

  // updateEmployee(emp: Employees): Observable<number>
  // {
  //   return this.http.put<number>(this.employeeUrl + this.updateEmployeeUrl + emp.id, emp);
  // }
}
