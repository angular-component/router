import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rr-unknown',
  template: ` <p>Invalid route or you have no access</p> `,
  styles: ['host: { display: block }'],
})
export class UnknownComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
