import { getLoaderData } from '@angular-component/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rr-restricted',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>This route is restricted. Toggle restriction to disable route access.</p>

    Loader Data: {{ (loaderData$ | async)[0] | json }}
  `,
  styles: ['host: { display: block }'],
})
export default class RestrictedComponent implements OnInit {
  loaderData$ = getLoaderData<any[]>();

  constructor() {}

  ngOnInit(): void {}
}
