import {Component, OnInit} from '@angular/core';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {take} from 'rxjs';
import {StudentService} from '../../services/student.service';
import {Student} from '../../models/student';

@Component({
  selector: 'navbar',
  imports: [
    Menubar,
    Button,
    Menu
  ],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  barItems: MenuItem[] = [];
  menuItems: MenuItem[] = [];

  currentStudent!: Student;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private router: Router) {
  }

  ngOnInit(): void {
    if (!localStorage.getItem('currentUser')) {
      this.studentService.getCurrentStudent().subscribe((student: Student) => {
        localStorage.setItem('currentUser', JSON.stringify(student));
        this.currentStudent = {...student};
      })
    } else {
      this.currentStudent = JSON.parse(localStorage.getItem('currentUser')!);
    }

    this.barItems = [
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        route: '/home',
      },
      {
        label: 'Asignaturas',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Components',
            route: '/login',
          },
          {
            label: 'Blocks',
            route: '/login'
          },
          {
            label: 'UI Kit',
            route: '/login'
          }
        ]
      },
      {
        label: 'Exámenes',
        icon: 'pi pi-pencil',
        route: '/login',
      },
      {
        label: 'Tareas',
        icon: 'pi pi-list',
        route: '/login',
      }
    ];

    this.menuItems = [
      {
        label: 'Ajustes',
        icon: 'pi pi-cog',
        route: '/login',
      },
      {
        label: 'Salir',
        icon: 'pi pi-sign-out',
        route: '/login',
      }
    ]
  }

  handleClickButton(route: string): void {
    void this.router.navigateByUrl(route);
  }

  handleLogout(): void {
    this.authService.logout().pipe(take(1)).subscribe({
      next: () => {
        void this.router.navigateByUrl('/login');
      }
    });
  }
}
