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
import { saveAs } from 'file-saver';
import {TaskService} from '../../services/task.service';
import {Task} from '../../models/task';
import {DatePipe} from '@angular/common';
import {Tag} from 'primeng/tag';
import {Checkbox} from 'primeng/checkbox';

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
    InputGroup,
    InputText,
    Ripple,
    TableModule,
    DatePipe,
    Tag,
    Checkbox
  ],
  templateUrl: './subject.component.html'
})
export class SubjectComponent implements OnInit {
  currentSubject: Subject = new Subject();
  currentChapters: Chapter[] = [];
  currentTasks: Task[] = [];
  currentStudent!: Student;
  currentFiles: PdfFile[] = [];
  newChapter: Chapter = new Chapter();
  fileToUpload!: File;
  fileToDelete: PdfFile = new PdfFile();
  chapterToDelete: Chapter = new Chapter();
  priorities!: any[];

  visibleNewChapter: boolean = false;
  visibleDeleteDocument: boolean = false;
  visibleDeleteChapter: boolean = false;
  visibleDeleteSubject: boolean = false;

  constructor(
    private subjectService: SubjectService,
    private chapterService: ChapterService,
    private pdfFileService: PdfFileService,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const subjectId = this.route.snapshot.params['id'];
    this.currentStudent = JSON.parse(localStorage.getItem('currentUser')!);

    this.subjectService.getSubject(subjectId).subscribe((subject: Subject) => {
      this.currentSubject = subject;
      this.setPrimaryColor(this.currentSubject.color)
    });

    this.chapterService.getCurrentChapters(subjectId).subscribe((chapters: Chapter[]) => {
      this.currentChapters = chapters;
      this.currentChapters.sort((a, b) => a.number - b.number);
    });

    this.pdfFileService.getFilesBySubjectId(subjectId).subscribe((files: PdfFile[] ) => {
      this.currentFiles = files;
    });

    this.taskService.getTasksBySubjectId(subjectId).subscribe((tasks: Task[]) => {
      this.currentTasks = tasks.filter((task: Task) => !task.completed);
    });

    this.priorities = [
      { label: 'Alta', number: 1, severity: 'danger' },
      { label: 'Media', number: 2, severity: 'warn' },
      { label: 'Baja', number: 3, severity: 'success' },
    ];
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

    this.chapterService.addChapter(this.newChapter).pipe(take(1)).subscribe({
      next: () => {
        this.resetForm();
        this.visibleNewChapter = false;
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
      }
    });
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
          window.location.reload();
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
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteChapter() {
    this.pdfFileService.deleteFileByChapterId(this.chapterToDelete.id!).pipe(
      switchMap(() => this.chapterService.deleteById(this.chapterToDelete.id!)),
      tap(() => window.location.reload())
    ).subscribe({
      error: err => console.error(err)
    });
  }

  deleteSubject() {
    this.pdfFileService.deleteFileBySubjectId(this.currentSubject.id!).pipe(
      switchMap(() => this.chapterService.deleteAllBySubjectId(this.currentSubject.id!)),
      switchMap(() => this.taskService.deleteBySubjectId(this.currentSubject.id!)),
      switchMap(() => this.subjectService.deleteById(this.currentSubject.id!)),
      tap(() => this.router.navigate(['/home']))
    ).subscribe({
      error: err => console.error(err)
    });
  }

  updateTaskCompletion(task: any) {
    this.taskService.addTask(task).pipe(take(1)).subscribe({});
  }

  getLabelByNumber(number: number): string {
    return this.priorities.find(priority => priority.number === number)?.label;
  }

  getSeverityByNumber(number: number): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    return this.priorities.find(priority => priority.number === number)?.severity as "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined;
  }

  protected readonly colorPalette = colorPalette;
}
