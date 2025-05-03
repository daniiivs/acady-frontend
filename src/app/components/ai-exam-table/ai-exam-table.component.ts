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
  @Input() examId!: string; // ID of the exam that will show
  @Input() dialogVisible: boolean = false; // Component's visibility
  @Input() chapterIds: (string | undefined)[] = []; // Chapters from the examn
  @Output() dialogClose: EventEmitter<any> = new EventEmitter(); // To emit the closing dialog event

  loadingGeneration: boolean = false; // If there's an AI exam being generated
  loadingExams: boolean = true; // If exams are loading
  currentAiExams: ExamAI[] = []; // List of all AI exams of a student
  filteredExams: ExamAI[] = []; // List of all AI exams associated to a specific exam
  currentStudent!: Student;
  examAIToDelete: ExamAI = new ExamAI();
  errorVisible: boolean = false;
  errorMessage: string = '';
  visibleDeleteExamDialog: boolean = false;

  constructor(
    private aiExamService: AiExamService,
    private router: Router) {}

  ngOnInit() {
    this.currentStudent = JSON.parse(localStorage.getItem('currentUser')!); // Get current student
    this.loadAIExams();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['examId']) { // Checks if the user chose another exam
      this.loadingExams = true;
    }
  }

  // Updates AI exams when the user chooses a new exam
  updateFilteredExams() {
    this.filteredExams = this.currentAiExams.filter(exam => exam.examId === this.examId);
    this.loadingExams = false;
    this.loadingGeneration = false;
  }

  closeDialog() {
    this.dialogClose.emit();
    this.errorVisible = false;
    this.errorMessage = '';
  }

  // Generates a new AI exam
  generateAIExam() {
    this.errorVisible = false;
    this.errorMessage = '';
    this.loadingGeneration = true;
    this.aiExamService.generateAIExam(this.examId, this.chapterIds).pipe(take(1)).subscribe({
      next: () => {
        this.loadAIExams(); // Loads exams again
      },
      error: (err) => { // Shows error to user
        this.errorVisible = true;
        this.errorMessage = err.error.error;
        this.loadingGeneration = false;
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
        this.loadingGeneration = false;
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
