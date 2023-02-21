import { Component } from "@angular/core";
import { getRouteParams } from "@angular-component/router";

@Component({
  selector: 'app-about',
  standalone: true,
  template: `Product ID: {{ id().id }}`
})
export class ProductComponent {
  id = getRouteParams<{ id: number }>();
}