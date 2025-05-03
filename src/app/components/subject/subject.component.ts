import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {NavbarComponent} from '../navbar/navbar.component';
import {Toolbar} from 'primeng/toolbar';
import {SubjectService} from '../../services/subject.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from '../../models/subject';
import {updatePreset} from '@primeng/themes';
import {colorPalette} from '../../app.config';
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion';
import {Dialog} from 'primeng/dialog';
import {FormsModule, NgForm} from '@angular/forms';
import {InputGroup} from 'primeng/inputgroup';
import {InputText} from 'primeng/inputtext';
import {Chapter} from '../../models/chapter';
import {ChapterService} from '../../services/chapter.service';
import {switchMap, take, tap} from 'rxjs';
import {Student} from '../../models/student';
import {Ripple} from 'primeng/ripple';
import {PdfFileService} from '../../services/pdf-file.service';
import {PdfFile} from '../../models/pdf-file';
import {TableModule} from 'primeng/table';
import {saveAs} from 'file-saver';
import {TaskService} from '../../services/task.service';
import {Task} from '../../models/task';
import {DatePipe} from '@angular/common';
import {Tag} from 'primeng/tag';
import {Checkbox} from 'primeng/checkbox';
import {ExamService} from '../../services/exam.service';
import {Select} from 'primeng/select';
import {Exam} from '../../models/exam';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs';

@Component({
  selector: 'subject',
  imports: [
    Button,
    Card,
    NavbarComponent,
    Toolbar,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    Dialog,
    FormsModule,
    InputText,
    Ripple,
    TableModule,
    DatePipe,
    Tag,
    Checkbox,
    ProgressSpinner,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
  ],
  templateUrl: './subject.component.html'
})
export class SubjectComponent implements OnInit {
  currentSubject: Subject = new Subject();
  currentChapters: Chapter[] = [];
  currentTasks: Task[] = [];
  currentStudent!: Student;
  currentFiles: PdfFile[] = [];
  currentExams: Exam[] = [];
  completedExams: Exam[] = [];
  newChapter: Chapter = new Chapter();
  fileToUpload!: File;
  fileToDelete: PdfFile = new PdfFile();
  chapterToDelete: Chapter = new Chapter();
  priorities!: any[];
  isInvalid: boolean = false;
  errorMessage: string = '';

  visibleNewChapter: boolean = false;
  visibleDeleteDocument: boolean = false;
  visibleDeleteChapter: boolean = false;
  visibleDeleteSubject: boolean = false;

  loadingChapters: boolean = true;
  loadingTasks: boolean = true;
  loadingExams: boolean = true;

  constructor(
    private subjectService: SubjectService,
    private chapterService: ChapterService,
    private pdfFileService: PdfFileService,
    private examService: ExamService,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const subjectId: string = this.route.snapshot.params['id'];
    this.currentStudent = JSON.parse(localStorage.getItem('currentUser')!);

    this.subjectService.getSubject(subjectId).subscribe((subject: Subject) => {
      this.currentSubject = subject;
      this.setPrimaryColor(this.currentSubject.color);
      this.loadChapters();
      this.loadPdfFiles();
      this.loadTasks();
      this.loadExams();
    });

    this.priorities = [
      {label: 'Alta', number: 1, severity: 'danger'},
      {label: 'Media', number: 2, severity: 'warn'},
      {label: 'Baja', number: 3, severity: 'success'},
    ];
  }

  loadChapters() {
    this.chapterService.getCurrentChapters(this.currentSubject.id!).subscribe((chapters: Chapter[]) => {
      this.currentChapters = chapters;
      this.currentChapters.sort((a, b) => a.number - b.number);
      this.loadingChapters = false;
    });
  }

  loadPdfFiles() {
    this.pdfFileService.getFilesBySubjectId(this.currentSubject.id!).subscribe((files: PdfFile[]) => {
      this.currentFiles = files;
    });
  }

  loadTasks() {
    this.taskService.getTasksBySubjectId(this.currentSubject.id!).subscribe((tasks: Task[]) => {
      this.currentTasks = tasks.filter((task: Task) => !task.completed);
      this.loadingTasks = false;
    });
  }

  loadExams() {
    this.examService.getExamsBySubjectId(this.currentSubject.id!).subscribe((exams: Exam[]) => {
      this.currentExams = exams.filter((exam: Exam) => !exam.completed);
      this.completedExams = exams.filter((exam: Exam) => exam.completed);
      this.loadingExams = false;
    })
  }

  setPrimaryColor(color: string) {
    updatePreset({
      semantic: {
        primary: colorPalette[color]
      }
    });
  }

  onSubmit(loginForm: NgForm) {
    this.newChapter.subjectId = this.currentSubject.id!;
    this.newChapter.studentId = this.currentStudent.id!;

    if (this.newChapter.number <= 0) {
      this.isInvalid = true;
      this.errorMessage = '* El número de tema debe ser mayor que 0';
      return;
    }

    if (this.currentChapters.filter((chapter: Chapter) => chapter.number == this.newChapter.number).length > 0) {
      this.isInvalid = true;
      this.errorMessage = '* Ya tienes un tema asignado al número ' + this.newChapter.number;
      return;
    }

    this.chapterService.addChapter(this.newChapter).pipe(take(1)).subscribe({
      next: () => {
        this.resetForm();
        this.visibleNewChapter = false;
        this.loadChapters()
      },
      error: () => {
        this.isInvalid = true;
        this.errorMessage = '* Ingresa un número válido';
      }
    });
  }

  formIsFilled() {
    if (this.newChapter.number !== undefined) {
      return this.newChapter.name.trim() !== '' && this.newChapter.number.toString().trim() !== '';
    }
    return false;
  }

  showNewChapterDialog() {
    this.visibleNewChapter = true;
  }

  showDeleteDocumentDialog(file: PdfFile) {
    this.fileToDelete = file;
    this.visibleDeleteDocument = true;
  }

  showDeleteChapterDialog(chapter: Chapter) {
    this.chapterToDelete = chapter;
    this.visibleDeleteChapter = true;
  }

  showDeleteSubjectDialog() {
    this.visibleDeleteSubject = true;
  }

  resetForm() {
    this.visibleNewChapter = false
    this.errorMessage = '';
    this.isInvalid = false;
    this.newChapter = new Chapter();
  }

  onFileSelected(event: Event, chapterId: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.fileToUpload = input.files[0];

      const allowedTypes = ['application/pdf'];
      if (!allowedTypes.includes(this.fileToUpload.type)) {
        alert('Tipo de archivo no permitido');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.fileToUpload);
      this.pdfFileService.saveFile(chapterId, this.currentSubject.id!, this.currentStudent.id!, formData).pipe(take(1)).subscribe({
        next: () => {
          this.loadPdfFiles();
        }
      });
    }
  }

  filterByChapterId(chapterId: string): PdfFile[] {
    return this.currentFiles.filter((file: PdfFile) => file.chapterId === chapterId);
  }

  resetFileToDelete() {
    this.visibleDeleteDocument = false;
    this.fileToDelete = new PdfFile();
  }

  resetChapterToDelete() {
    this.visibleDeleteChapter = false;
    this.chapterToDelete = new Chapter();
  }

  downloadPdf(file: PdfFile): void {
    this.pdfFileService.downloadFile(file.id).subscribe((blob: Blob) => {
      saveAs(blob, file.filename);
    });
  }

  deleteFile() {
    this.pdfFileService.deleteFileById(this.fileToDelete.id).pipe(take(1)).subscribe({
      next: () => {
        this.loadPdfFiles();
        this.visibleDeleteDocument = false;
        this.fileToDelete = new PdfFile();
      }
    });
  }

  deleteChapter() {
    this.chapterService.deleteById(this.chapterToDelete.id!).pipe(take(1)).subscribe({
      next: () => {
        this.visibleDeleteChapter = false;
        this.chapterToDelete = new Chapter();
        this.loadChapters();
      }
    });
  }

  deleteSubject() {
    this.subjectService.deleteById(this.currentSubject.id!).pipe(take(1)).subscribe({
      next: () => {
        void this.router.navigate(['/home']);
      }
    });
  }

  updateTaskCompletion(task: any) {
    this.taskService.addTask(task).pipe(take(1)).subscribe();
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

  protected readonly colorPalette = colorPalette;
}
