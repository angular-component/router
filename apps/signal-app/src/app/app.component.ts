import { Component } from '@angular/core';
import { ROUTER_COMPONENTS } from '@angular-component/router';
import { AboutComponent } from './about.component';

@Component({
  standalone: true,
  imports: [ROUTER_COMPONENTS, AboutComponent],
  selector: 'signal-router-root',
  template: `
    <a linkTo="/">Home</a> 
    | <a linkTo="/about">About</a> 
    | <a linkTo="/products">Products</a> 
    <p>
      <router>
        <route path="/products" [exact]="false" [load]="components.products"> </route>
        <route path="/about" [load]="components.about"> </route>
        <route path="/" [exact]="true" [load]="components.home"> </route>
      </router>
    </p>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  components = {
    about: () => import('./about.component').then((m) => m.AboutComponent),
    home: () => import('./home.component').then((m) => m.HomeComponent),
    products: () =>
      import('./products.component').then((m) => m.ProductsComponent),
  };
}
