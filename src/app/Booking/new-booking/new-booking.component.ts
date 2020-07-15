import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewBookingService } from '../../services/new-booking.service';
import { RoomsComponent } from '../../Room/rooms/rooms.component';
import { ToastrService } from 'ngx-toastr';
import {AuthService} from '../../services/auth.service';
import {$e} from 'codelyzer/angular/styles/chars';

@Component({
  selector: 'app-new-booking',
  templateUrl: './new-booking.component.html',
  styleUrls: ['./new-booking.component.css'],
})
export class NewBookingComponent implements OnInit {
  bookingForm: FormGroup;
  showHide: boolean;
  rooms: any;
  users: any;
  userId:number;
  constructor(
    public authService:AuthService,
    private formBuilder: FormBuilder,
    private newBookingService: NewBookingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.user.id;
    this.bookingForm = this.formBuilder.group({
      date: [Date, Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      title: ['', Validators.required],
      roomId: [null, Validators.required],
      userId: [this.authService.user.id, Validators.required],

    });
    this.showHide = true;
    this.onGetRooms();
    this.onGetUsers();
  }
  onGetRooms() {
    this.newBookingService.getRooms().subscribe(
      (data) => {
        this.rooms = data['_embedded']['rooms'];
      },
      (err) => {
        console.error(err);
      }
    );
  }
  onGetUsers() {
    this.newBookingService.getUsers().subscribe(
      (data) => {
        this.users = [];
        data['_embedded']['users']?.forEach(user => {
          this.users.push(user);
        });
        data['_embedded']['etudiants']?.forEach(user => {
          this.users.push(user);
        });
        data['_embedded']['professeurs']?.forEach(user => {
          this.users.push(user);
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }
  onSubmit() {
    var bookingFormData = this.bookingForm.value;
    console.log(bookingFormData);
    this.saveBookings(bookingFormData);
    this.showHide = false;
  }

  saveBookings(bookingFormData) {

    this.newBookingService.saveBooking(bookingFormData).subscribe(
      (data) => {
        if (data == 'oui') {
          this.toastr.success('Booking Added Successfully');
        } else {
          this.toastr.error('Booking Not Added Successfully');
        }
        console.log(data);
      },
      (err) => {
        if (err.error.text == 'oui') {
          this.toastr.success('Booking Added Successfully');
        } else {
          this.toastr.error('Booking Not Added Successfully');
        }
        console.log(err.error.text);
      }
    );
  }

  showForm_addMore() {
    this.showHide = true;
    this.bookingForm.reset();
  }

  onChangeZ($event: any) {
    console.log($event);
  }
}
