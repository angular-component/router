import { Component } from '@angular/core';
import { Router } from 'angular-routing';

@Component({
  selector: 'ra-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'responsive-app';
  constructor(public readonly router: Router) {}
}
