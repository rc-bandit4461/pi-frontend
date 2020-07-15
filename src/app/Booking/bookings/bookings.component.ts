import {Component, OnInit} from '@angular/core';
import {BookingsService} from '../../services/bookings.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
  animations: [],
})
export class BookingsComponent implements OnInit {
  rooms: any;
  date: string;
  users: any[];
  bookings: any[];
  isLoaded:boolean = false;
  isError:boolean = false;
  bookingForm: FormGroup;
  formBuilder: FormBuilder;

  constructor(
    private httpClient:HttpClient,
    private boukingService: BookingsService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.onGetBookings();
    // this.bookingForm = this.formBuilder.group({
    //   datee: '',
    // });
  }

  async onGetBookings() {
   try {
      let data = await this.boukingService.getBookings().toPromise();
    this.bookings = <any[]>data['_embedded']['bookings'];
    for (const booking of this.bookings) {
        booking['user'] = await this.httpClient.get(booking._links.self.href + '/user').toPromise();
        booking['room'] = await this.httpClient.get(booking._links.self.href + '/room').toPromise();
    }
    this.isLoaded = true;
     console.log(this.bookings);
   }catch (e) {
     this.isError = true
     console.log(e);
   }
    // this.boukingService.getBookings().subscribe(
    //   (data) => {
    //     this.bookings = data;
    //   },
    //   (err) => {
    //     console.error(err);
    //   }
    // );
  }

  onDeleteBoonking(id: number): void {
    this.onGetBookings();
    this.boukingService.deleteBooking(id).subscribe(
      (data) => {
        this.toastr.success('Booking Deleted Successfully');
        this.onGetBookings();
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
