import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditBookingService } from '../../services/edit-booking.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css'],
})
export class EditBookingComponent implements OnInit {
  bookingForm: FormGroup;
  showHide: boolean;
  index: number;
  booking: any;
  rooms: any;
  users: any;
  constructor(
    private formBuilder: FormBuilder,
    private editBookingService: EditBookingService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.index = parseInt(this.route.snapshot.paramMap.get('id'));
    this.onGetBooking(this.index);
  }

  ngOnInit(): void {
    console.log('helooooo' + this.index);

    this.bookingForm = this.formBuilder.group({
      id: [null, Validators.required],
      date: [Date, Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      title: ['', Validators.required],
      roomId: [null, Validators.required],
      userId: [null, Validators.required],
    });
    this.bookingForm.patchValue({
      id: this.index,
    });
    this.onGetRooms();
    this.onGetUsers();
  }
  onGetRooms() {
    this.editBookingService.getRooms().subscribe(
      (data) => {
        this.rooms = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }
  onGetUsers() {
    this.editBookingService.getUsers().subscribe(
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
    console.log(bookingFormData);
    this.saveBookings(this.index, bookingFormData);
  }
  onGetBooking(index) {
    this.editBookingService.getBookingById(index).subscribe(
      (data) => {
        this.booking = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  saveBookings(index, bookingFormData) {
    this.editBookingService.saveBooking(index, bookingFormData).subscribe(
      (data) => {
        this.toastr.success('Booking Edited Successfully');
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
