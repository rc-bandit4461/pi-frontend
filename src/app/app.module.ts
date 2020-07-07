import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { FilieresComponent } from './filiere/filieres/filieres.component';
import { ElementsComponent } from './element/elements/elements.component';
import { CreateElementComponent } from './element/create-element/create-element.component';
import { CreateFiliereComponent } from './filiere/create-filiere/create-filiere.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { EditFiliereComponent } from './filiere/edit-filiere/edit-filiere.component';
import { CreateSessionComponent } from './session/create-session/create-session.component';
import { EditSessionComponent } from './session/edit-session/edit-session.component';
import { SessionsComponent } from './session/sessions/sessions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { SessionActionsComponent } from './session/session-actions/session-actions.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import { SessionExamsComponent } from './session/session-exams/session-exams.component';
import { EditExamenComponent } from './session/edit-examen/edit-examen.component';
import {DataTablesModule} from 'angular-datatables';
import { NotemoduleEditComponent } from './session/notemodule-edit/notemodule-edit.component';
import { NotemodulesComponent } from './session/notemodules/notemodules.component';
import { SemestreComponent } from './sessions/semestre/semestre.component';
import { SessionEditComponent } from './sessions/session-edit/session-edit.component';
import { DemandeReleveListComponent } from './demandes/demande-releve-list/demande-releve-list.component';

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
    SessionActionsComponent,
    SessionExamsComponent,
    EditExamenComponent,
    NotemoduleEditComponent,
    NotemodulesComponent,
    SemestreComponent,
    SessionEditComponent,
    DemandeReleveListComponent
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
    MatSlideToggleModule,
    MatInputModule,
    DataTablesModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
