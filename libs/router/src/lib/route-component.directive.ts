import { Directive, Input, Type } from '@angular/core';

@Directive({
  selector: '[routeComponent]',
  standalone: true,
})
export class RouteComponentTemplate {
  @Input() routeComponent!: Type<any> | string;
}
