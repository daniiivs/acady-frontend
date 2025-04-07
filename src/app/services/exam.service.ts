import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Exam} from '../models/exam';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private url: string = 'http://localhost:8080/exams';

  constructor(private http: HttpClient) { }

  getExamsByStudentId(id: string): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.url}/student/${id}`, {withCredentials: true});
  }

  getExamsBySubjectId(id: string): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.url}/subject/${id}`, {withCredentials: true});
  }

  addExam(exam: Exam): Observable<void> {
    return this.http.post<void>(`${this.url}/add`, exam, {withCredentials: true});
  }

  deleteById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`, {withCredentials: true});
  }

  deleteBySubjectId(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/subject/${id}`, {withCredentials: true});
  }

  deleteByChapterId(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/chapter/${id}`, {withCredentials: true});
  }
}
