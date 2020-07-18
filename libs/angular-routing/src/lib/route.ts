import { Type, NgModuleFactory } from '@angular/core';

import { Params } from './route-params.service';

export type Load = () => Promise<NgModuleFactory<any> | Type<any> | any>;

export interface Route {
  path: string;
  // component?: Type<any>;
  load?: Load;
  matcher?: RegExp;
  options: RouteOptions;
}

export interface RouteOptions {
  exact?: boolean;
}

export interface ActiveRoute {
  route: Route;
  params: Params;
}

export interface ModuleWithRoute {
  routeComponent: Type<any>;
}
