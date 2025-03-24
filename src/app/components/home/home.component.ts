import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from '../navbar/navbar.component';
import {Card} from 'primeng/card';
import {Panel} from 'primeng/panel';
import {Toolbar} from 'primeng/toolbar';
import {SubjectCarouselComponent} from '../subject-carousel/subject-carousel.component';
import {updatePreset} from '@primeng/themes';
import {colorPalette} from '../../app.config';
import {ScrollPanel} from 'primeng/scrollpanel';

@Component({
  selector: 'home',
  imports: [
    NavbarComponent,
    Card,
    Toolbar,
    SubjectCarouselComponent,
    ScrollPanel
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    ngOnInit(): void {
      updatePreset({
        semantic: {
          primary: colorPalette['gray']
        }
      });
    }
}
