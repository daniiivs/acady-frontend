import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Chapter} from '../models/chapter';
import {ExamAI} from '../models/examAI';

@Injectable({
  providedIn: 'root'
})
export class AiExamService {
  private url: string = 'http://localhost:8080/aiexam';

  constructor(private http: HttpClient) {
  }

  getExamAIByStudentId(id: string): Observable<ExamAI[]> {
    return this.http.get<ExamAI[]>(`${this.url}/student/${id}`, { withCredentials: true });
  }

  generateAIExam(id: string, chapterIds: (string | undefined)[]): Observable<ExamAI> {
    return this.http.post<ExamAI>(`${this.url}/generate/${id}`, chapterIds, { withCredentials: true });
  }

  deleteById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`, { withCredentials: true });
  }

  getAIExamById(id: string): Observable<ExamAI> {
    return this.http.get<ExamAI>(`${this.url}/${id}`, { withCredentials: true });
  }

  save(examAI: ExamAI): Observable<void> {
    return this.http.post<void>(`${this.url}/save`, examAI, { withCredentials: true });
  }
}
