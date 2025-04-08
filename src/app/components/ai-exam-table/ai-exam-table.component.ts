import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Dialog} from 'primeng/dialog';
import {ExamAI} from '../../models/ExamAI';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import { AiExamService } from '../../services/ai-exam.service';
import {Student} from '../../models/student';
import {take} from 'rxjs';
import {ProgressBar} from 'primeng/progressbar';

@Component({
  selector: 'ai-exam-table',
  imports: [
    Dialog,
    Button,
    TableModule,
    ProgressBar
  ],
  templateUrl: './ai-exam-table.component.html'
})
export class AiExamTableComponent implements OnInit {
  @Input() examId!: string;
  @Input() dialogVisible: boolean = false;
  @Input() chapterIds: (string | undefined)[] = [];
  @Output() dialogClose: EventEmitter<any> = new EventEmitter();

  loading = false;
  currentAiExams: ExamAI[] = [];
  filteredExams: ExamAI[] = [];
  currentStudent!: Student;

  constructor(
    private aiExamService: AiExamService) {}

  ngOnInit() {
    this.currentStudent = JSON.parse(localStorage.getItem('currentUser')!);

    this.aiExamService.getExamAIByStudentId(this.currentStudent.id!).subscribe((exams: ExamAI[]) => {
      this.currentAiExams = exams;
    });
  }

  updateFilteredExams() {
    this.filteredExams = this.currentAiExams.filter(exam => exam.examId === this.examId);
  }

  closeDialog() {
    this.dialogClose.emit();
  }

  generateAIExam() {
    this.loading = true;
    this.aiExamService.generateAIExam(this.examId, this.chapterIds).pipe(take(1)).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }
}
