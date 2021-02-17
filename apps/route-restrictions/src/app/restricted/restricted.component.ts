import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rr-restricted',
  template: `
    <p>This route is restricted. Toggle restriction to disable route access.</p>
  `,
  styles: ['host: { display: block }'],
})
export class RestrictedComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
