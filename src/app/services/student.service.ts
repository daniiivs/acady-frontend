import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Student} from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private url: string = 'http://ec2-51-20-127-223.eu-north-1.compute.amazonaws.com:8080/api/students';

  constructor(private http: HttpClient) {
  }

  getCurrentStudent(): Observable<Student> {
    return this.http.get<Student>(`${this.url}/current`);
  }
}
