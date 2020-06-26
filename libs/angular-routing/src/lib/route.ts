import { Type } from '@angular/core';

import { Params } from './route-params.service';

export type LoadComponent = () => Promise<Type<any>>;

export interface Route {
  path: string;
  // component?: Type<any>;
  loadComponent?: LoadComponent;
  matcher?: RegExp;
}

export interface ActiveRoute {
  route: Route;
  params: Params;
}
