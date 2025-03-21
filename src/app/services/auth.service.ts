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

  login(username: string, password: string): Observable<any> {
    const credentials = {username, password};
    return this.http.post(`${this.url}/login`, credentials, { withCredentials: true }).pipe(
      catchError(this.handleLoginError)
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.url}/logout`, {}, { withCredentials: true });
  }

  private handleRegisterError(error: HttpErrorResponse) {
    if (error.status === 409) {
      return throwError(() => new Error(error.error.error));
    }
    return throwError(() => new Error('Ocurrió un error inesperado.'));
  }

  private handleLoginError(error: HttpErrorResponse) {
    if (error.status === 401) {
      return throwError(() => new Error('¡Las credenciales son inválidas!'));
    } else {
      return throwError(() => new Error(error.error.error));
    }
  }
}
