import {Component, OnInit} from '@angular/core';
import {Step, StepList, StepPanel, StepPanels, Stepper} from 'primeng/stepper';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {Router, RouterLink} from '@angular/router';
import {Password} from 'primeng/password';
import {Student} from '../../models/student';
import {FormsModule, NgForm, NgModel} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {take} from 'rxjs';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'register',
  imports: [
    Stepper,
    StepList,
    Step,
    StepPanels,
    StepPanel,
    Button,
    Card,
    FloatLabel,
    IconField,
    InputIcon,
    InputText,
    RouterLink,
    Password,
    FormsModule,
    Dialog
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  currentStep: number = 1;

  registeredStudent: Student;
  repeatPassoword: String = '';
  visible: boolean = false;

  emailAlreadyUsed: boolean = false;
  usernameAlreadyUsed: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router) {
    this.registeredStudent = new Student();
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      void this.router.navigate(['/home']);
    }
  }

  onSubmit(registerForm: NgForm): void {
    if (!registerForm.invalid) {
      this.registeredStudent.email = this.registeredStudent.email.toLowerCase();
      this.authService.registerStudent(this.registeredStudent).pipe(take(1)).subscribe({
        next: () => {
          this.showDialog();
        },
        error: err => {
          if (err.message.includes('email')) {
            this.emailAlreadyUsed = true;
          }
          if (err.message.includes('username')) {
            this.usernameAlreadyUsed = true;
          }
          this.goToStep(1);
        }
      });
    }
  }

  isInvalid(fieldValues: string[], ngModels: NgModel[]) {
    let isDisabled: boolean = false;

    fieldValues.forEach(value => {
      if (value.trim() === '') {
        isDisabled = true;
      }
    });

    ngModels.forEach(field => {
      if (field.invalid) {
        isDisabled = true;
      }
    });

    return isDisabled;
  }

  passwordsMatch(): boolean {
    if (this.registeredStudent.password === '') {
      return true;
    }
    return this.registeredStudent.password !== this.repeatPassoword;
  }

  showDialog() {
    this.visible = true;
  }

  navigateToLogin(): void {
    this.visible = false;
    void this.router.navigateByUrl('/login');
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  resetEmailError() {
    this.emailAlreadyUsed = false;
  }

  resetUsernameError() {
    this.usernameAlreadyUsed = false;
  }
}
