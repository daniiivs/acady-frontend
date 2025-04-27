import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {ExamAI} from '../../models/examAI';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import { AiExamService } from '../../services/ai-exam.service';
import {Student} from '../../models/student';
import {take} from 'rxjs';
import {ProgressBar} from 'primeng/progressbar';
import {colorPalette} from '../../app.config';
import {Router} from '@angular/router';
import {ProgressSpinner} from 'primeng/progressspinner';

@Component({
  selector: 'ai-exam-table',
  imports: [
    Dialog,
    Button,
    TableModule,
    ProgressBar,
    ProgressSpinner
  ],
  templateUrl: './ai-exam-table.component.html'
})
export class AiExamTableComponent implements OnInit, OnChanges {
  @Input() examId!: string;
  @Input() dialogVisible: boolean = false;
  @Input() chapterIds: (string | undefined)[] = [];
  @Output() dialogClose: EventEmitter<any> = new EventEmitter();

  loading: boolean = false;
  loadingExams: boolean = true;
  currentAiExams: ExamAI[] = [];
  filteredExams: ExamAI[] = [];
  currentStudent!: Student;
  examAIToDelete: ExamAI = new ExamAI();

  visibleDeleteExamDialog: boolean = false;

  constructor(
    private aiExamService: AiExamService,
    private router: Router) {}

  ngOnInit() {
    this.currentStudent = JSON.parse(localStorage.getItem('currentUser')!);
    this.loadAIExams();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['examId']) {
      this.loadingExams = true;
    }
  }

  updateFilteredExams() {
    this.filteredExams = this.currentAiExams.filter(exam => exam.examId === this.examId);
    this.loadingExams = false;
    this.loading = false;
  }

  closeDialog() {
    this.dialogClose.emit();
  }

  generateAIExam() {
    this.loading = true;
    this.aiExamService.generateAIExam(this.examId, this.chapterIds).pipe(take(1)).subscribe({
      next: () => {
        this.loadAIExams();
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  loadAIExams() {
    this.aiExamService.getExamAIByStudentId(this.currentStudent.id!).subscribe({
      next: (exams: ExamAI[]) => {
        this.currentAiExams = exams;
        this.updateFilteredExams();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  protected readonly colorPalette = colorPalette;

  showDeteleAIExamDialog(exam: ExamAI) {
    this.visibleDeleteExamDialog = true;
    this.examAIToDelete = exam;
  }

  resetExamToDelete() {
    this.visibleDeleteExamDialog = false;
    this.examAIToDelete = new ExamAI();
  }

  deleteExam() {
    this.aiExamService.deleteById(this.examAIToDelete.id!).pipe(take(1)).subscribe({
      next: () => {
        this.loadAIExams();
        this.examAIToDelete = new ExamAI();
        this.visibleDeleteExamDialog = false;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  handleClickViewExam(id: string): void {
    void this.router.navigateByUrl(`/aiexam/${id}`).then(() => {
      window.location.reload();
    });
  }
}
