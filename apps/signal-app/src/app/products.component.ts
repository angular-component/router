import { Component } from "@angular/core";
import { ROUTER_COMPONENTS } from "@angular-component/router";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ROUTER_COMPONENTS],
  template: `
    <a linkTo="/products">Product Home</a>
    | <a linkTo="/products/1">Product 1</a>
    | <a linkTo="/products/2">Product 2</a>

    <p>
      <router>
        <route path="/:id" [load]="components.product"> </route>
        <route path="/" [load]="components.home"> </route>
      </router>
    </p>
  `
})
export class ProductsComponent {
  components = {
    product: () => import('./product.component').then(m => m.ProductComponent),
    home: () => import('./products-home.component').then(m => m.ProductsHomeComponent)
  }
}