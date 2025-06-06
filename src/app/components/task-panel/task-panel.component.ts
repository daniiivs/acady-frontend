import {Component, OnInit} from '@angular/core';
import {Card} from 'primeng/card';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {NavbarComponent} from '../navbar/navbar.component';
import {Toolbar} from 'primeng/toolbar';
import {updatePreset} from '@primeng/themes';
import {Subject} from '../../models/subject';
import {Student} from '../../models/student';
import {SubjectService} from '../../services/subject.service';
import {colorPalette} from '../../app.config';
import {Button} from 'primeng/button';
import {Task} from '../../models/task';
import {take} from 'rxjs';
import {TaskService} from '../../services/task.service';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {DatePicker} from 'primeng/datepicker';
import {Select} from 'primeng/select';
import {Tag} from 'primeng/tag';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {Checkbox} from 'primeng/checkbox';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'task-panel',
  imports: [
    Card,
    FormsModule,
    NavbarComponent,
    ReactiveFormsModule,
    Toolbar,
    Button,
    Dialog,
    InputText,
    DatePicker,
    Select,
    Tag,
    TableModule,
    DatePipe,
    Checkbox,
    ProgressSpinner
  ],
  templateUrl: './task-panel.component.html'
})
export class TaskPanelComponent implements OnInit {
  currentStudent!: Student;
  currentSubjects: Subject[] = [];
  currentTasks: Task[] = [];
  newTask: Task = new Task();
  taskToDelete: Task = new Task();

  priorities!: any[];
  visibleNewTask: boolean = false;
  visibleDeleteTask: boolean = false;
  loading: boolean = true;

  constructor(
    private subjectService: SubjectService,
    private taskService: TaskService) {}

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

    this.loadTasks();

    this.priorities = [
      { label: 'Alta', number: 1, severity: 'danger' },
      { label: 'Media', number: 2, severity: 'warn' },
      { label: 'Baja', number: 3, severity: 'success' },
    ];
  }

  loadTasks() {
    this.taskService.getTasksByStudentId(this.currentStudent.id!).subscribe((tasks: Task[]) => {
      this.currentTasks = tasks;
      this.loading = false;
    });
  }

  showNewTaskDialog() {
    this.visibleNewTask = true;
  }

  showDeleteTaskDialog(task: Task) {
    this.taskToDelete = task;
    this.visibleDeleteTask = true;
  }

  resetForm() {
    this.visibleNewTask = false
    this.newTask = new Task();
  }

  resetTaskToDelete() {
    this.visibleDeleteTask = false;
    this.taskToDelete = new Task();
  }

  deleteTask() {
    this.taskService.deleteById(this.taskToDelete.id!).pipe(take(1)).subscribe({
      next: () => {
        this.loadTasks();
        this.visibleDeleteTask = false;
        this.taskToDelete = new Task();
      }
    });
  }

  onSubmit(loginForm: NgForm) {
    this.newTask.completed = false;
    this.newTask.studentId = this.currentStudent.id!;

    this.taskService.addTask(this.newTask).pipe(take(1)).subscribe({
      next: () => {
        this.resetForm();
        this.visibleNewTask = false;
        this.loadTasks();
      }
    });
  }

  getColorById(id: string): string {
    return this.currentSubjects.find(subject => subject.id === id)?.color!;
  }

  getNameById(id: string): string {
    return this.currentSubjects.find(subject => subject.id === id)?.name!;
  }

  getLabelByNumber(number: number): string {
    return this.priorities.find(priority => priority.number === number)?.label;
  }

  getSeverityByNumber(number: number): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    return this.priorities.find(priority => priority.number === number)?.severity as "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined;
  }

  protected readonly colorPalette = colorPalette;

  updateTaskCompletion(task: any) {
    this.taskService.addTask(task).pipe(take(1)).subscribe({});
  }

  formIsFilled(): boolean {
    return this.newTask.description.trim() !== '' &&
      this.newTask.duedate !== undefined &&
      this.newTask.subjectId !== undefined &&
      this.newTask.priority !== undefined;
  }
}
