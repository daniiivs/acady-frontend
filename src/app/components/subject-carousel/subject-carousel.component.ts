import {Component, Input} from '@angular/core';
import {Carousel} from 'primeng/carousel';
import {NgStyle} from '@angular/common';
import {colorPalette} from '../../app.config';
import {Ripple} from 'primeng/ripple';
import {Subject} from '../../models/subject';

@Component({
  selector: 'subject-carousel',
  imports: [
    Carousel,
    NgStyle,
    Ripple
  ],
  templateUrl: './subject-carousel.component.html'
})
export class SubjectCarouselComponent {
  @Input() currentSubjects!: Subject[];

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  protected readonly colorPalette = colorPalette;
  protected readonly console = console;
}
