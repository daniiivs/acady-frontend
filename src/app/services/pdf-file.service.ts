import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Chapter} from '../models/chapter';
import {PdfFile} from '../models/pdf-file';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PdfFileService {
  private url: string = 'http://localhost:8080/files';

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient) {
  }

  saveFile(chapterId: string, subjectId: string, studentId: string, file: FormData): Observable<Chapter[]> {
    return this.http.post<Chapter[]>(`${this.url}/upload/${chapterId}&&${subjectId}&&${studentId}`, file, { withCredentials: true });
  }

  getFilesBySubjectId(subjectId: string): Observable<PdfFile[]> {
    return this.http.get<PdfFile[]>(`${this.url}/subject/${subjectId}`, { withCredentials: true });
  }

  deleteFileById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`, { withCredentials: true });
  }

  deleteFileByChapterId(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/chapter/${id}`, { withCredentials: true });
  }

  deleteFileBySubjectId(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/subject/${id}`, { withCredentials: true });
  }

  deleteFileByStudentId(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/student/${id}`, { withCredentials: true });
  }

  downloadFile(id: string): Observable<Blob> {
    return this.http.get(`${this.url}/download/${id}`, {
      responseType: 'blob',
      withCredentials: true
    });
  }
}
