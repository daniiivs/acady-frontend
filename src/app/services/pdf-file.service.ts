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
  private url: string = 'http://ec2-51-20-127-223.eu-north-1.compute.amazonaws.com:8080/api/files';

  constructor(
    private http: HttpClient) {
  }

  saveFile(chapterId: string, subjectId: string, studentId: string, file: FormData): Observable<Chapter[]> {
    return this.http.post<Chapter[]>(`${this.url}/upload/${chapterId}&&${subjectId}&&${studentId}`, file);
  }

  getFilesBySubjectId(subjectId: string): Observable<PdfFile[]> {
    return this.http.get<PdfFile[]>(`${this.url}/subject/${subjectId}`);
  }

  deleteFileById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }

  downloadFile(id: string): Observable<Blob> {
    return this.http.get(`${this.url}/download/${id}`, {
      responseType: 'blob'
    });
  }
}
