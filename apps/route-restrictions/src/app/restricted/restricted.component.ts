import { getLoaderData } from '@angular-component/router';
import { Component, OnInit } from '@angular/core';

export function loader() {
  return fetch('https://jsonplaceholder.typicode.com/todos').then((response) =>
    response.json()
  );
}

@Component({
  selector: 'rr-restricted',
  template: `
    <p>This route is restricted. Toggle restriction to disable route access.</p>

    Loader Data: {{ (loaderData$ | async)[0] | json }}
  `,
  styles: ['host: { display: block }'],
})
export class RestrictedComponent implements OnInit {
  loaderData$ = getLoaderData<any[]>();

  constructor() {}

  ngOnInit(): void {}
}
