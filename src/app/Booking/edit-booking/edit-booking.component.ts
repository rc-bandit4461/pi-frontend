import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {EditBookingService} from '../../services/edit-booking.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';

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
  userId;
  roomId;
  public isError = false;
  public isLoaded = false;
  users: any;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private editBookingService: EditBookingService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private httpClient: HttpClient
  ) {

  }

  ngOnInit(): void {


    this.index = parseInt(this.route.snapshot.paramMap.get('id'));
    this.getData();

  }

  async getData() {
    try {
      await this.onGetRooms();
      await this.onGetUsers();
      await this.onGetBooking(this.index);
      // this.bookingForm.patchValue({
      //   id: this.index,
      //   roomId:this.booking.room.id,
      //   userId:this.booking.user.id,
      // });
      console.log("OK");
      console.log("OK");
      console.log("OK");
      console.log(this.booking);
      this.userId = this.booking.user.id;
      this.roomId = this.booking.room.id;
      this.bookingForm = this.formBuilder.group({
        id: [this.index, Validators.required],
        date: [Date, Validators.required],
        start: ['', Validators.required],
        end: ['', Validators.required],
        title: ['', Validators.required],
        roomId: [this.roomId, Validators.required],
        userId: [this.userId, Validators.required],
      });
      this.isLoaded = true;

      this.isLoaded = true;
    } catch (e) {
      console.log(e);
      this.isError = true;
    }
  }

  onGetRooms() {
    this.editBookingService.getRooms().subscribe(
      (data) => {
        this.rooms = data['_embedded']['rooms'];
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onGetUsers() {
    this.editBookingService.getUsers().subscribe(
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
    // return;
    this.saveBookings(this.index, bookingFormData);
  }

  async onGetBooking(index) {
    this.booking = await this.editBookingService.getBookingById(index).toPromise();
    this.booking.user = await this.httpClient.get(this.booking._links.self.href + '/user').toPromise();
    this.booking.room = await this.httpClient.get(this.booking._links.self.href + '/room').toPromise();
    console.log(this.booking);
  }

  saveBookings(index, bookingFormData) {
    this.editBookingService.saveBooking(index, bookingFormData).subscribe(
      (data) => {
        console.log(data);
        this.toastr.success('Booking Edited Successfully');
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
