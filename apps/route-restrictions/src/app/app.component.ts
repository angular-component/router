import { RouteLoadMap } from '@angular-component/router';
import { Component } from '@angular/core';

@Component({
  selector: 'reactiveangular-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'route-restrictions';
  components: RouteLoadMap = {
    rr: () => import('./restricted/restricted.component'),
  };

  restricted = false;

  toggle() {
    this.restricted = !this.restricted;
  }

  restrictedLoader() {
    return fetch('https://jsonplaceholder.typicode.com/todos').then(
      (response) => response.json()
    );
    // .then(json => console.log(json))
  }
}
