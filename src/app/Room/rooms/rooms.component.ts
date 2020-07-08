import {Component, OnInit} from '@angular/core';
import {RoomsService} from '../../services/rooms.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
})
export class RoomsComponent implements OnInit {
  rooms: any;
  title = 'appBootstrap';
  keyword: string;

  closeResult: string;

  constructor(
    public auth: AuthenticationService,
    private roomservice: RoomsService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.auth.authentication(false, 'any');
    this.onGetRooms();
  }

  onGetRooms() {
    this.roomservice.getRooms().subscribe(
      (data) => {
        this.rooms = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onDeleteRoom(id: number): void {
    this.roomservice.deleteRoom(id).subscribe(
      (data) => {
        this.toastr.success('Room Deleted Successfully');
        this.onGetRooms();
      },
      (err) => {
        this.toastr.error('Room not Deleted');
        console.error(err);
      }
    );
  }

  open(content) {
    this.modalService
      .open(content, {ariaLabelledBy: 'modal-basic-title'})
      .result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
