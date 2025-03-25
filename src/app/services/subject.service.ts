import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Subject} from '../models/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private url: string = 'http://localhost:8080/subjects';

  constructor(private http: HttpClient) { }

  getSubjects(studentId: string): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.url}/all/${studentId}`, {withCredentials: true});
  }

  addSubject(subject: Subject): Observable<void> {
    return this.http.post<void>(`${this.url}/add`, subject, {withCredentials: true});
  }
}
