import { NgModule } from '@angular/core';
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


const routes: Routes = [
  {
    path:'admin/elements',
    component:ElementsComponent
  },
  {
    path:'admin/filieres',
    component:FilieresComponent
  },
  {
    path:'admin/filieres/create',
    component:CreateFiliereComponent
  },
  {
    path:'admin/filieres/edit/:url',
    component:EditFiliereComponent
  },
    {
    path:'admin/sessions',
    component:SessionsComponent
  },
  {
    path:'admin/sessions/create',
    component:CreateSessionComponent
  },
  {
    path:'admin/sessions/edit/:url',
    component:EditSessionComponent
  },
    {
    path:'admin/sessions/:id',
    component:SessionActionsComponent
  },
  {
    path:'admin/sessions/:id/examens',
    component:SessionExamsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
