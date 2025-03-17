import { Component } from '@angular/core';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {NgOptimizedImage} from '@angular/common';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {InputIcon} from 'primeng/inputicon';
import {IconField} from 'primeng/iconfield';
import {RouterLink} from '@angular/router';
import {Password, PasswordDirective} from 'primeng/password';

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
    PasswordDirective,
    Password
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

}
