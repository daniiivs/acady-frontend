import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Subject} from '../models/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private url: string = 'http://localhost:8080/api/subjects';

  constructor(private http: HttpClient) { }

  getSubject(subjectId: string): Observable<Subject> {
    return this.http.get<Subject>(`${this.url}/${subjectId}`);
  }

  getSubjectList(studentId: string): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.url}/all/${studentId}`);
  }

  addSubject(subject: Subject): Observable<void> {
    return this.http.post<void>(`${this.url}/add`, subject);
  }

  deleteById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }
}
