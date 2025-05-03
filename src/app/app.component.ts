import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {PrimeNG} from 'primeng/config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(private primeng: PrimeNG) {
  }

  ngOnInit(): void {
    this.primeng.ripple.set(true);
  }
}
