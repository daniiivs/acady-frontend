import {Component, OnInit} from '@angular/core';
import {Card} from 'primeng/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavbarComponent} from '../navbar/navbar.component';
import {Toolbar} from 'primeng/toolbar';
import {updatePreset} from '@primeng/themes';
import {Subject} from '../../models/subject';
import {Student} from '../../models/student';
import {SubjectService} from '../../services/subject.service';
import {colorPalette} from '../../app.config';
import {Button} from 'primeng/button';
import {Task} from '../../models/task';

@Component({
  selector: 'task-panel',
  imports: [
    Card,
    FormsModule,
    NavbarComponent,
    ReactiveFormsModule,
    Toolbar,
    Button
  ],
  templateUrl: './task-panel.component.html'
})
export class TaskPanelComponent implements OnInit {
  currentStudent!: Student;
  currentSubjects: Subject[] = [];
  currentTasks: Task[] = [];

  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    updatePreset({
      semantic: {
        primary: colorPalette['gray']
      }
    });

    this.currentStudent = JSON.parse(localStorage.getItem('currentUser')!);

    this.subjectService.getSubjectList(this.currentStudent.id!).subscribe((subjects: Subject[]) => {
      this.currentSubjects = subjects;
    });


  }
}
