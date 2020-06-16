import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { FilieresComponent } from './filiere/filieres/filieres.component';
import { ElementsComponent } from './element/elements/elements.component';
import { CreateElementComponent } from './element/create-element/create-element.component';
import { CreateFiliereComponent } from './filiere/create-filiere/create-filiere.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EditFiliereComponent } from './filiere/edit-filiere/edit-filiere.component';
import { CreateSessionComponent } from './Session/create-session/create-session.component';
import { EditSessionComponent } from './Session/edit-session/edit-session.component';
import { SessionsComponent } from './Session/sessions/sessions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { RoomsComponent } from './Room/rooms/rooms.component';
import { BookingsComponent } from './Booking/bookings/bookings.component';
import { NewRoomComponent } from './Room/new-room/new-room.component';
import { EditRoomComponent } from './Room/edit-room/edit-room.component';
import { NewBookingComponent } from './Booking/new-booking/new-booking.component';
import { EditBookingComponent } from './Booking/edit-booking/edit-booking.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    AppComponent,
    FilieresComponent,
    ElementsComponent,
    CreateElementComponent,
    CreateFiliereComponent,
    EditFiliereComponent,
    CreateSessionComponent,
    EditSessionComponent,
    SessionsComponent,
    RoomsComponent,
    BookingsComponent,
    NewRoomComponent,
    EditRoomComponent,
    NewBookingComponent,
    EditBookingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatListModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgbModule,
    BsDropdownModule.forRoot(),
    PerfectScrollbarModule,
    Ng2SearchPipeModule,
    NgbModalModule,
    ToastrModule.forRoot(),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  exports: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
