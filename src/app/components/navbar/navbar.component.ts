import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {take} from 'rxjs';
import {Student} from '../../models/student';
import {Subject} from '../../models/subject';
import {SubjectService} from '../../services/subject.service';
import {colorPalette} from '../../app.config';
import {TieredMenu} from 'primeng/tieredmenu';

@Component({
  selector: 'navbar',
  imports: [
    Menubar,
    Button,
    Menu
  ],
  templateUrl: './navbar.component.html'
})

export class NavbarComponent implements OnInit, OnChanges {
  @Input() subjectAdded: boolean = false;

  barItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      route: '/home',
    },
    {
      label: 'Asignaturas',
      icon: 'pi pi-book'
    },
    {
      label: 'Exámenes',
      icon: 'pi pi-pencil',
      route: '/exams',
    },
    {
      label: 'Tareas',
      icon: 'pi pi-list',
      route: '/tasks',
    }
  ];

  menuItems: MenuItem[] = [];

  currentStudent!: Student;
  currentSubjects!: Subject[];
  subjectsMenu: any[] = [];

  constructor(
    private authService: AuthService,
    private subjectService: SubjectService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.currentStudent = JSON.parse(localStorage.getItem('currentUser')!);
    this.loadSubjects();

    this.menuItems = [
      {
        label: 'Salir',
        icon: 'pi pi-sign-out',
        route: '/login',
      }
    ]
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentStudent = JSON.parse(localStorage.getItem('currentUser')!);
    if (changes['subjectAdded']) {
      this.loadSubjects();
    }
  }

  loadSubjects(): void {
    this.subjectService.getSubjectList(this.currentStudent.id!).subscribe((subjects: Subject[]) => {
      this.currentSubjects = subjects;
      this.setMenuBar();
    });
  }

  setMenuBar(): void {
    this.subjectsMenu = [];
    for (const subject of this.currentSubjects) {
      this.subjectsMenu.push({
        label: subject.name,
        color: subject.color,
        id: subject.id
      });
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
        items: this.subjectsMenu
      },
      {
        label: 'Exámenes',
        icon: 'pi pi-pencil',
        route: '/exams',
      },
      {
        label: 'Tareas',
        icon: 'pi pi-list',
        route: '/tasks',
      }
    ];
  }

  handleClickButton(route: string): void {
    void this.router.navigateByUrl(route);
  }

  handleClickSubject(id: string): void {
    void this.router.navigateByUrl(`/subject/${id}`).then(() => {
      window.location.reload();
    });
  }

  handleLogout(): void {
    this.authService.logout().pipe(take(1)).subscribe({
      next: () => {
        void this.router.navigateByUrl('/login');
      }
    });
  }

  protected readonly colorPalette = colorPalette;
  protected readonly navigator = navigator;
}
