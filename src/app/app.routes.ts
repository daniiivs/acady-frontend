import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HomeComponent} from './components/home/home.component';
import {SubjectComponent} from './components/subject/subject.component';
import {TaskPanelComponent} from './components/task-panel/task-panel.component';
import {ExamPanelComponent} from './components/exam-panel/exam-panel.component';
import {ExamAiFormComponent} from './components/exam-ai-form/exam-ai-form.component';
import {authGuard} from './guards/auth.guard';

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
    canActivate: [authGuard],
  },
  {
    path: 'subject/:id',
    component: SubjectComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tasks',
    component: TaskPanelComponent,
    canActivate: [authGuard],
  },
  {
    path: 'exams',
    component: ExamPanelComponent,
    canActivate: [authGuard],
  },
  {
    path: 'aiexam/:id',
    component: ExamAiFormComponent,
    canActivate: [authGuard],
  }
];
