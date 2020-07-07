import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {ElementsComponent} from './element/elements/elements.component';
import {FilieresComponent} from './filiere/filieres/filieres.component';
import {CreateFiliereComponent} from './filiere/create-filiere/create-filiere.component';
import {EditFiliereComponent} from './filiere/edit-filiere/edit-filiere.component';
import {SessionsComponent} from './session/sessions/sessions.component';
import {CreateSessionComponent} from './session/create-session/create-session.component';
import {EditSessionComponent} from './session/edit-session/edit-session.component';
import {SessionActionsComponent} from './session/session-actions/session-actions.component';
import {SessionExamsComponent} from './session/session-exams/session-exams.component';
import {EditExamenComponent} from './session/edit-examen/edit-examen.component';
import {NotemoduleEditComponent} from './session/notemodule-edit/notemodule-edit.component';
import {NotemodulesComponent} from './session/notemodules/notemodules.component';
import {SemestreComponent} from './sessions/semestre/semestre.component';
import {DemandeReleveListComponent} from './demandes/demande-releve-list/demande-releve-list.component';
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

    path:'admin/sessions/:id/edit',
    component:EditSessionComponent

  },
  {
    path: 'admin/bookings',
    component: BookingsComponent,

  },
  {
    path:'admin/demandeReleves',
    component:DemandeReleveListComponent
  },
    {
    path:'admin/sessions/:id',
    component:SessionActionsComponent
  },
  {
    path:'admin/sessions/:idSession/modules/:idModule/edit',
    component:NotemoduleEditComponent
  },
    {
    path:'admin/sessions/:idSession/modules/:idModule/view',
    component:NotemodulesComponent
  },
  {
    path:'admin/sessions/:idSession/semestres/:idSemestre',
    component:SemestreComponent
  },
  {
    path:'admin/sessions/:id/examens',
    component:SessionExamsComponent
  },
  {
    path:'admin/examens/:id/edit',
    component:EditExamenComponent
  },


];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
