import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[routeComponent]',
  standalone: true,
})
export class RouteComponentTemplate {
  @Input() routeComponent: any;
}
