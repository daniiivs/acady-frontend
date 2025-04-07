import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HomeComponent} from './components/home/home.component';
import {SubjectComponent} from './components/subject/subject.component';
import {TaskPanelComponent} from './components/task-panel/task-panel.component';
import {ExamPanelComponent} from './components/exam-panel/exam-panel.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'subject/:id',
    component: SubjectComponent,
  },
  {
    path: 'tasks',
    component: TaskPanelComponent
  },
  {
    path: 'exams',
    component: ExamPanelComponent
  }
];
