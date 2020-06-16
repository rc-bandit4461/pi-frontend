import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ElementsComponent } from './element/elements/elements.component';
import { FilieresComponent } from './filiere/filieres/filieres.component';
import { CreateFiliereComponent } from './filiere/create-filiere/create-filiere.component';
import { EditFiliereComponent } from './filiere/edit-filiere/edit-filiere.component';
import { SessionsComponent } from './Session/sessions/sessions.component';
import { CreateSessionComponent } from './Session/create-session/create-session.component';
import { EditSessionComponent } from './Session/edit-session/edit-session.component';
import { RoomsComponent } from './Room/rooms/rooms.component';
import { NewRoomComponent } from './Room/new-room/new-room.component';
import { EditRoomComponent } from './Room/edit-room/edit-room.component';
import { EditBookingComponent } from './Booking/edit-booking/edit-booking.component';
import { BookingsComponent } from './Booking/bookings/bookings.component';
import { NewBookingComponent } from './Booking/new-booking/new-booking.component';

const routes: Routes = [
  {
    path: 'admin/elements',
    component: ElementsComponent,
  },
  {
    path: 'admin/filieres',
    component: FilieresComponent,
  },
  {
    path: 'admin/filieres/create',
    component: CreateFiliereComponent,
  },
  {
    path: 'admin/filieres/edit/:url',
    component: EditFiliereComponent,
  },
  {
    path: 'admin/sessions',
    component: SessionsComponent,
  },
  {
    path: 'admin/sessions/create',
    component: CreateSessionComponent,
  },
  {
    path: 'admin/sessions/edit/:url',
    component: EditSessionComponent,
  },
  {
    path: 'admin/rooms',
    component: RoomsComponent,
  },
  {
    path: 'admin/newRoom',
    component: NewRoomComponent,
  },
  {
    path: 'admin/newBooking',
    component: NewBookingComponent,
  },
  {
    path: 'admin/editRoom/:id',
    component: EditRoomComponent,
  },
  {
    path: 'admin/editBooking/:id',
    component: EditBookingComponent,
  },
  {
    path: 'admin/bookings',
    component: BookingsComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
