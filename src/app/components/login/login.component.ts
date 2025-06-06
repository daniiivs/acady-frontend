import {Component, OnInit} from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule, NgForm} from '@angular/forms';
import {InputIcon} from 'primeng/inputicon';
import {IconField} from 'primeng/iconfield';
import {Router, RouterLink} from '@angular/router';
import {Password} from 'primeng/password';
import {AuthService} from '../../services/auth.service';
import {take} from 'rxjs';
import {updatePreset} from '@primeng/themes';
import {colorPalette} from '../../app.config';
import {StudentService} from '../../services/student.service';
import {Student} from '../../models/student';

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
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';

  isInvalid: boolean = false;
  errorMessage!: string;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private router: Router) {
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) { // Redirects if user is already logged in
      void this.router.navigate(['/home']);
    }

    updatePreset({ // Changes main color to gray
      semantic: {
        primary: colorPalette['gray']
      }
    });
  }

  onSubmit(loginForm: NgForm): void {
    if (this.username == '' || this.password == '') { // If fields are empty...
      this.errorMessage = '* ¡Rellena todos los campos!'
      this.isInvalid = true;
      return;
    }

    if (!loginForm.invalid) {
      this.authService.login(this.username, this.password).pipe(take(1)).subscribe({ // Logs in
        next: () => {
          this.studentService.getCurrentStudent().pipe(take(1)).subscribe((student: Student) => {
            localStorage.setItem('currentUser', JSON.stringify(student)); // Saves logged user in local storage
            void this.router.navigateByUrl('/home'); // Redirects to home page
          });
        },
        error: err => { // Gets and shows possible errors
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
