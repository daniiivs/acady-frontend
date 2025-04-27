import {Component, OnInit} from '@angular/core';
import {Card} from 'primeng/card';
import {FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {NavbarComponent} from '../navbar/navbar.component';
import {TableModule} from 'primeng/table';
import {Toolbar} from 'primeng/toolbar';
import {ExamAI} from '../../models/examAI';
import {AiExamService} from '../../services/ai-exam.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Student} from '../../models/student';
import {Subject} from '../../models/subject';
import {Chapter} from '../../models/chapter';
import {SubjectService} from '../../services/subject.service';
import {ChapterService} from '../../services/chapter.service';
import {RadioButton} from 'primeng/radiobutton';
import {finalize, take} from 'rxjs';
import {Button} from 'primeng/button';
import {Question} from '../../models/question';

@Component({
  selector: 'exam-ai-form',
  imports: [
    Card,
    FormsModule,
    NavbarComponent,
    ReactiveFormsModule,
    TableModule,
    Toolbar,
    RadioButton,
    Button
  ],
  templateUrl: './exam-ai-form.component.html'
})
export class ExamAiFormComponent implements OnInit {
  currentAIExam: ExamAI = new ExamAI();
  currentStudent: Student = new Student();
  currentSubject: Subject = new Subject();
  currentChapters: Chapter[] = [];

  constructor(
    private aiExamService: AiExamService,
    private subjectService: SubjectService,
    private chapterService: ChapterService,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    const currentAIExamId = this.route.snapshot.params['id'];
    this.currentStudent = JSON.parse(localStorage.getItem('currentUser')!);

    this.aiExamService.getAIExamById(currentAIExamId).subscribe((exam: ExamAI) => {
      this.currentAIExam = exam;
      this.subjectService.getSubject(exam.subjectId).subscribe((subject: Subject) => {
        this.currentSubject = subject;
      });
      this.chapterService.getCurrentChapters(exam.subjectId).subscribe((chapters: Chapter[]) => {
        this.currentChapters = chapters.filter((chapter: Chapter) => exam.chapterIds.includes(chapter.id));
      });
    });
  }

  onSubmit(form: NgForm) {
    let grade = 0;

    for (const question of this.currentAIExam.questions) {
      if (question.chosenAnswer == question.correctAnswer) {
        grade++;
      }
    }

    this.currentAIExam.grade = grade;

    this.aiExamService.save(this.currentAIExam).pipe(take(1)).subscribe({
      next: () => {
        window.location.reload();
      }
    });
  }

  goBack() {
    void this.router.navigateByUrl(`/exams`);
  }

  isCompleted(): boolean {
    return this.currentAIExam.grade > -1;
  }
}
