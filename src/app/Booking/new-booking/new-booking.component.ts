import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewBookingService } from '../../services/new-booking.service';
import { RoomsComponent } from '../../Room/rooms/rooms.component';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private formBuilder: FormBuilder,
    private newBookingService: NewBookingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.bookingForm = this.formBuilder.group({
      date: [Date, Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      title: ['', Validators.required],
      roomId: [null, Validators.required],
      userId: [null, Validators.required],
    });
    this.showHide = true;
    this.onGetRooms();
    this.onGetUsers();
  }
  onGetRooms() {
    this.newBookingService.getRooms().subscribe(
      (data) => {
        this.rooms = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }
  onGetUsers() {
    this.newBookingService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }
  onSubmit() {
    var bookingFormData = this.bookingForm.value;
    console.log(this.bookingForm.value);
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
}
