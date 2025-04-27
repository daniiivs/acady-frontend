import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Checkbox} from 'primeng/checkbox';
import {DatePicker} from 'primeng/datepicker';
import {DatePipe} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NavbarComponent} from '../navbar/navbar.component';
import {Select} from 'primeng/select';
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {Toolbar} from 'primeng/toolbar';
import {colorPalette} from '../../app.config';
import {SubjectService} from '../../services/subject.service';
import {ExamService} from '../../services/exam.service';
import {updatePreset} from '@primeng/themes';
import {Subject} from '../../models/subject';
import {Task} from '../../models/task';
import {Student} from '../../models/student';
import {Exam} from '../../models/exam';
import {Chapter} from '../../models/chapter';
import {ChapterService} from '../../services/chapter.service';
import {take} from 'rxjs';
import {MultiSelect} from 'primeng/multiselect';
import {AiExamTableComponent} from '../ai-exam-table/ai-exam-table.component';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'exam-panel',
  imports: [
    Button,
    Card,
    Checkbox,
    DatePicker,
    DatePipe,
    Dialog,
    FormsModule,
    InputText,
    NavbarComponent,
    ReactiveFormsModule,
    Select,
    TableModule,
    Tag,
    Toolbar,
    MultiSelect,
    AiExamTableComponent,
    ProgressSpinner
  ],
  templateUrl: './exam-panel.component.html'
})
export class ExamPanelComponent implements OnInit {
  currentStudent!: Student;
  currentSubjects: Subject[] = [];
  currentChapters: Chapter[] = [];
  currentExams: Exam[] = [];
  newExam: Exam = new Exam();
  examToDelete: Exam = new Exam();
  completedExam: Exam = new Exam();
  selectedExam: Exam = new Exam();
  examIDForAIExam!: string;
  isInvalid: boolean = false;
  errorMessage: string = '';

  visibleNewExam: boolean = false;
  visibleDeleteExam: boolean = false;
  visibleCompletedExam: boolean = false;
  visibleAIExam: boolean = false;

  loading: boolean = true;

  constructor(
    private subjectService: SubjectService,
    private chapterService: ChapterService,
    private examService: ExamService
  ) {
  }

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

    this.chapterService.getChaptersByStudentId(this.currentStudent.id!).subscribe((chapters: Chapter[]) => {
      this.currentChapters = chapters;
    });

    this.loadExams();
  }

  loadExams() {
    this.examService.getExamsByStudentId(this.currentStudent.id!).subscribe((exams: Exam[]) => {
      this.currentExams = exams;
      this.loading = false;
    });
  }

  showNewExamDialog() {
    this.visibleNewExam = true;
  }

  showDeleteExamDialog(exam: Exam) {
    this.examToDelete = exam;
    this.visibleDeleteExam = true;
  }

  completedChanged(exam: Exam) {
    this.completedExam = exam;

    if (exam.completed) {
      this.visibleCompletedExam = true;
    } else {
      this.completedExam.grade = undefined;
      this.onSubmitCompletedExam();
    }
  }

  resetForm() {
    this.visibleNewExam = false
    this.newExam = new Exam();
  }

  resetExamToDelete() {
    this.visibleDeleteExam = false;
    this.examToDelete = new Exam();
  }

  resetCompletedExam() {
    this.visibleCompletedExam = false;
    this.completedExam = new Exam();
    this.loadExams();
    this.isInvalid = false;
  }

  deleteExam() {
    this.examService.deleteById(this.examToDelete.id!).pipe(take(1)).subscribe({
      next: () => {
        this.loadExams();
        this.examToDelete = new Exam();
        this.visibleDeleteExam = false;
      }
    });
  }

  onSubmitNewExam(loginForm: NgForm) {
    this.newExam.completed = false;
    this.newExam.studentId = this.currentStudent.id!;

    this.examService.addExam(this.newExam).pipe(take(1)).subscribe({
      next: () => {
        this.resetForm();
        this.visibleNewExam = false;
        this.loadExams();
      }
    });
  }

  onSubmitCompletedExam() {
    if (this.completedExam.grade?.toString().trim() == '') {
      this.errorMessage = 'Introduce una nota';
      this.isInvalid = true;
      return;
    }

    if (this.completedExam.grade! > 10 || this.completedExam.grade! < 0) {
      this.errorMessage = 'Introduce una nota válida';
      this.isInvalid = true;
      return;
    }

    this.examService.addExam(this.completedExam).pipe(take(1)).subscribe({
      next: () => {
        this.completedExam = new Exam();
        this.visibleCompletedExam = false;
        this.isInvalid = false;
        this.errorMessage = '';
        this.loadExams();
      },
      error: () => {
        this.errorMessage = 'Introduce un número válido';
        this.isInvalid = true;
      }
    });
  }

  getColorById(id: string): string {
    return this.currentSubjects.find(subject => subject.id === id)?.color!;
  }

  getNameById(id: string): string {
    return this.currentSubjects.find(subject => subject.id === id)?.name!;
  }

  filterChapterByChosenSubject() {
    return this.currentChapters.filter(chapter => chapter.subjectId === this.newExam.subjectId).sort((a, b) => a.number - b.number);
  }

  sortSelectedChapters() {
    this.newExam.chapterIds = this.newExam.chapterIds
      .map(id => this.currentChapters.find(chapter => chapter.id === id)!) // Convertir IDs a objetos
      .sort((a, b) => a.number - b.number) // Ordenar por label
      .map(option => option.id); // Convertir de nuevo a IDs
  }

  getChaptersByExamId(exam: Exam) {
    return exam.chapterIds
      .map(id => this.currentChapters.find(chapter => chapter.id === id)!)
      .sort((a, b) => a.number - b.number);
  }

  formIsFilled() {
    return this.newExam.date !== undefined &&
      this.newExam.subjectId !== '' &&
      this.newExam.chapterIds.length > 0;
  }

  resetNewChapters() {
    this.newExam.chapterIds = [];
  }

  protected readonly colorPalette = colorPalette;

  onRowSelect($event: any) {
    this.examIDForAIExam = $event.data.id;
    this.visibleAIExam = true;
  }

  handleDialogClose() {
    this.selectedExam = new Exam();
    this.visibleAIExam = false;
  }
}
