import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Task} from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private url: string = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) { }

  getTasksByStudentId(id: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}/all/student/${id}`);
  }

  getTasksBySubjectId(id: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}/all/subject/${id}`);
  }

  addTask(task: Task): Observable<any> {
    return this.http.post(`${this.url}/add`, task);
  }

  deleteById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${id}`);
  }
}
