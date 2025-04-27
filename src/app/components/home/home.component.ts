import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from '../navbar/navbar.component';
import {Card} from 'primeng/card';
import {Toolbar} from 'primeng/toolbar';
import {SubjectCarouselComponent} from '../subject-carousel/subject-carousel.component';
import {updatePreset} from '@primeng/themes';
import {colorPalette} from '../../app.config';
import {Student} from '../../models/student';
import {Subject} from '../../models/subject';
import {SubjectService} from '../../services/subject.service';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {InputGroup} from 'primeng/inputgroup';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {PrimeTemplate} from 'primeng/api';
import {Popover} from 'primeng/popover';
import {take} from 'rxjs';
import {Ripple} from "primeng/ripple";
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Task} from '../../models/task';
import {DatePipe} from '@angular/common';
import {TaskService} from '../../services/task.service';
import {ExamService} from '../../services/exam.service';
import {Exam} from '../../models/exam';
import {ChapterService} from '../../services/chapter.service';
import {Chapter} from '../../models/chapter';
import {Skeleton} from 'primeng/skeleton';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'home',
  imports: [
    NavbarComponent,
    Card,
    Toolbar,
    SubjectCarouselComponent,
    Button,
    Dialog,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    InputGroup,
    InputGroupAddon,
    Popover,
    PrimeTemplate,
    Ripple,
    TableModule,
    Tag,
    DatePipe,
    ProgressSpinner
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  currentStudent!: Student;
  currentSubjects: Subject[] = [];
  currentChapters: Chapter[] = [];
  currentTasks: Task[] = [];
  currentExams: Exam[] = [];
  newSubject: Subject = new Subject();
  visible: boolean = false;
  isInvalid: boolean = false;
  errorMessage: string = '';
  colorList: string[] = [];
  chosenColor: string = 'gray';
  priorities!: any[];
  subjectAdded = false;

  loadingSubjects: boolean = true;
  loadingChapters: boolean = true;
  loadingTasks: boolean = true;
  loadingExams: boolean = true;

  constructor(
    private subjectService: SubjectService,
    private chapterService: ChapterService,
    private examService: ExamService,
    private taskService: TaskService) {
  }

  ngOnInit(): void {
    updatePreset({
      semantic: {
        primary: colorPalette['gray']
      }
    });

    this.currentStudent = JSON.parse(localStorage.getItem('currentUser')!);

    this.loadSubjects();

    this.chapterService.getChaptersByStudentId(this.currentStudent.id!).subscribe((chapters: Chapter[]) => {
      this.currentChapters = chapters;
      this.loadingChapters = false;
    })

    this.taskService.getTasksByStudentId(this.currentStudent.id!).subscribe((tasks: Task[]) => {
      this.currentTasks = tasks.filter((task: Task) => !task.completed);
      this.loadingTasks = false;
    });

    this.examService.getExamsByStudentId(this.currentStudent.id!).subscribe((exams: Exam[]) => {
      this.currentExams = exams.filter((exam: Exam) => !exam.completed);
      this.loadingExams = false;
    })

    this.priorities = [
      {label: 'Alta', number: 1, severity: 'danger'},
      {label: 'Media', number: 2, severity: 'warn'},
      {label: 'Baja', number: 3, severity: 'success'},
    ];

    for (const color in colorPalette) {
      if (color == 'gray') {
        continue;
      }
      this.colorList.push(color);
    }
  }

  loadSubjects() {
    this.loadingSubjects = true;
    this.subjectService.getSubjectList(this.currentStudent.id!).subscribe((subjects: Subject[]) => {
      this.currentSubjects = subjects;
      this.loadingSubjects = false;
    });
  }

  showDialog() {
    this.visible = true;
  }

  onSubmit(loginForm: NgForm) {
    this.newSubject.studentId = this.currentStudent.id!;
    this.newSubject.code = this.newSubject.code.toUpperCase();
    this.newSubject.color = this.chosenColor;

    if (this.newSubject.color === 'gray') {
      this.isInvalid = true;
      this.errorMessage = '* Debes elegir un color';
      return;
    }

    if (this.currentSubjects.filter((subject: Subject) => subject.color === this.newSubject.color).length > 0) {
      this.isInvalid = true;
      this.errorMessage = '* Este color ya está en uso';
      return;
    }

    if (this.currentSubjects.filter((subject: Subject) => subject.code === this.newSubject.code).length > 0) {
      this.isInvalid = true;
      this.errorMessage = '* Este código ya está en uso';
      return;
    }

    this.subjectService.addSubject(this.newSubject).pipe(take(1)).subscribe({
      next: () => {
        this.resetForm();
        this.visible = false;
        this.subjectAdded = !this.subjectAdded;
        this.loadSubjects();
      }
    });
  }

  setColor(color: string, op: Popover) {
    this.chosenColor = color;
    op.hide();
  }

  resetForm() {
    this.visible = false
    this.errorMessage = '';
    this.isInvalid = false;
    this.chosenColor = 'gray';
    this.newSubject = new Subject();
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

  getChaptersByExamId(exam: Exam) {
    return exam.chapterIds
      .map(id => this.currentChapters.find(chapter => chapter.id === id)!)
      .sort((a, b) => a.number - b.number);
  }

  formIsFilled(): boolean {
    return this.newSubject.code.length === 3 &&
      this.newSubject.name.trim() !== '';
  }

  protected readonly colorPalette = colorPalette;
}
