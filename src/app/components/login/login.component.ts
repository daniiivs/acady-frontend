import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {NgOptimizedImage} from '@angular/common';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule, NgForm} from '@angular/forms';
import {InputIcon} from 'primeng/inputicon';
import {IconField} from 'primeng/iconfield';
import {Router, RouterLink} from '@angular/router';
import {Password, PasswordDirective} from 'primeng/password';
import {AuthService} from '../../services/auth.service';
import {Student} from '../../models/student';
import {take} from 'rxjs';

@Component({
  selector: 'login',
  imports: [
    Button,
    Card,
    FloatLabel,
    InputText,
    FormsModule,
    InputIcon,
    IconField,
    RouterLink,
    Password
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  isInvalid: boolean = false;
  errorMessage!: string;

  constructor(
    private authService: AuthService,
    private router: Router) {
  }

  onSubmit(loginForm: NgForm): void {
    if (this.username == '' || this.password == '') {
      this.errorMessage = '* ¡Rellena todos los campos!'
      this.isInvalid = true;
      return;
    }

    if (!loginForm.invalid) {
      this.authService.login(this.username, this.password).pipe(take(1)).subscribe({
        next: () => {
          console.log('login success');
        },
        error: err => {
          if (err.status === 401) {
            this.errorMessage = '* ¡Las credenciales son incorrectas!'
            this.isInvalid = true;
          }
        }
      });
    }
  }

  resetInvalidCredentials = (): void => {
    this.isInvalid = false;
  }
}
