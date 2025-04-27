import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Chapter} from '../models/chapter';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {
  private url: string = 'http://localhost:8080/chapters';

  constructor(private http: HttpClient) {
  }

  getChaptersByStudentId(studentId: string): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(`${this.url}/student/${studentId}`, { withCredentials: true });
  }

  getCurrentChapters(subjectId: string): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(`${this.url}/all/${subjectId}`, { withCredentials: true });
  }

  addChapter(chapter: Chapter): Observable<void> {
    return this.http.post<void>(`${this.url}/add`, chapter, {withCredentials: true});
  }

  deleteById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`, { withCredentials: true });
  }
}
