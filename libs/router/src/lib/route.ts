import { Type, NgModule } from '@angular/core';

import { Params } from './route-params.service';

export type Load = () => Promise<NgModule | Type<any> | any>;

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
  path: string;
}

export interface ModuleWithRoute {
  routeComponent: Type<any>;
}
