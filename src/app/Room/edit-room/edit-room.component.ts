import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EditRoomService } from '../../services/edit-room.service';
import { ActivatedRoute } from '@angular/router';
import { Room } from '../../Models/Room';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.css'],
})
export class EditRoomComponent implements OnInit {
  roomForm: FormGroup;
  showHide: boolean;
  index: number;
  rooms: any;

  constructor(
    private formBuilder: FormBuilder,
    private editRoomService: EditRoomService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.index = parseInt(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.onGetRoom(this.index);
    this.roomForm = this.formBuilder.group({
      id: null,
      name: ['Salle ', Validators.required],
      location: ['', Validators.required],
      seats: [null, Validators.required],
      state: Boolean,
      detail: [''],
      pcs: [null, Validators.required],
      projector: [null, Validators.required],
      board: [null, Validators.required],
    });
    this.roomForm.patchValue({
      id: this.index,
    });
    //   for(let r of rooms){
    //   name: this.rooms.name;
    //   location: this.rooms.location;
    //   seats: this.rooms.seats;
    //   state: this.rooms.state;
    //   detail: this.rooms.detail;
    //   pcs: this.rooms.pcs;
    //   projector: this.rooms.projector;
    //   board: this.rooms.board;
    //   }
    // });
  }

  onSubmit() {
    var roomFormData = this.roomForm.value;
    console.log(roomFormData);
    this.saveRooms(this.index, roomFormData);
  }
  onGetRoom(index) {
    this.editRoomService.getRoomById(index).subscribe(
      (data) => {
        this.rooms = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  saveRooms(index, roomFormData) {
    this.editRoomService.saveRoom(index, roomFormData).subscribe(
      (data) => {
        this.toastr.success('Room Edited Successfully');
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
