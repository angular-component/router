import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rr-home',
  template: ` <p>This route is OPEN</p> `,
  styles: ['host: { display: block }'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
