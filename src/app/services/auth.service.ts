import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Student} from '../models/student';
import {catchError, Observable, tap, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url: string = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {
  }

  registerStudent(student: Student): Observable<any> {
    return this.http.post<any>(`${this.url}/register`, student).pipe(
      catchError(this.handleRegisterError)
    );
  }

  login(username: string, password: string): Observable<{ token: string }> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password)

    return this.http.post<{ token: string }>(`${this.url}/login`, body.toString(),
      {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .pipe(
        tap((response) => {
          console.log(response.token);
          localStorage.setItem('token', response.token);
        })
      );
  }

  logout(): Observable<any> {
    localStorage.clear();
    return this.http.post(`${this.url}/logout`, null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleRegisterError(error: HttpErrorResponse) {
    if (error.status === 409) {
      return throwError(() => new Error(error.error.error));
    }
    return throwError(() => new Error('Ocurrió un error inesperado.'));
  }
}
