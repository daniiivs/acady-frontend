import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private url: string = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient) {
  }
}
