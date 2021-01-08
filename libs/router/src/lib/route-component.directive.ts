import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[routeComponent]',
})
export class RouteComponentTemplate {
  @Input() routeComponent: any;
}
