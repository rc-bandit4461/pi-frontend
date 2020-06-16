import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewRoomService } from '../../services/new-room.service';
import { ToastrService } from 'ngx-toastr';
import { State } from '../../Models/State';
import { LayoutCapacity } from '../../Models/LayoutCapacity';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-room',
  templateUrl: './new-room.component.html',
  styleUrls: ['./new-room.component.css'],
})
export class NewRoomComponent implements OnInit {
  roomForm: FormGroup;
  showHide: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private newRoomService: NewRoomService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.roomForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: [''],
      seats: null,
      state: Boolean,
      detail: [''],
      pcs: null,
      projector: null,
      board: null,
    });
    this.showHide = true;
  }

  onSubmit() {
    var roomFormData = this.roomForm.value;
    console.log(roomFormData);
    this.saveRooms(roomFormData);
    this.showHide = false;
  }

  saveRooms(roomFormData) {
    this.newRoomService.saveRoom(roomFormData).subscribe(
      (data) => {
        this.toastr.success('Room Added Successfully');
      },
      (err) => {
        console.error(err);
      }
    );
  }

  showForm_addMore() {
    this.showHide = true;
    this.roomForm.reset();
  }
}
