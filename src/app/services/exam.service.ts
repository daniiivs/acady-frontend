import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Exam} from '../models/exam';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private url: string = 'http://ec2-51-20-127-223.eu-north-1.compute.amazonaws.com:8080/api/exams';

  constructor(private http: HttpClient) { }

  getExamsByStudentId(id: string): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.url}/student/${id}`);
  }

  getExamsBySubjectId(id: string): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.url}/subject/${id}`);
  }

  addExam(exam: Exam): Observable<void> {
    return this.http.post<void>(`${this.url}/add`, exam);
  }

  deleteById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }
}
