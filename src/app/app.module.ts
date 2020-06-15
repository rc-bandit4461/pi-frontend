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
import { CreateSessionComponent } from './Session/create-session/create-session.component';
import { EditSessionComponent } from './Session/edit-session/edit-session.component';
import { SessionsComponent } from './Session/sessions/sessions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';

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
    SessionsComponent
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


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
