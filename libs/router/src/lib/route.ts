import { Type, NgModule } from '@angular/core';
import { LoaderFunction } from './data';

import type { Params } from './route-params.service';

export type Load = () => Promise<NgModule | Type<any> | any>;

export interface Route {
  path: string;
  // component?: Type<any>;
  load?: Load;
  loader?: LoaderFunction;
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
