import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Student} from '../models/student';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {
  }

  registerStudent(student: Student): Observable<any> {
    return this.http.post<any>(`${this.url}/register`, student).pipe(
      catchError(this.handleRegisterError)
    );
  }

  private handleRegisterError(error: HttpErrorResponse) {
    if (error.status === 409) {
      return throwError(() => new Error(error.error.error));
    }
    return throwError(() => new Error('Ocurrió un error inesperado.'));
  }
}
