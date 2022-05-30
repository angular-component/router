import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Params {
  [param: string]: any;
}

export class RoutePath<T extends string = string> extends Observable<T> {}

export class RouteParams<T extends Params = Params> extends Observable<T> {}

export class QueryParams<T extends Params = Params> extends Observable<T> {}

export function compareParams(previous: Params, current: Params): boolean {
  return (
    previous === current || JSON.stringify(previous) === JSON.stringify(current)
  );
}

/**
 * Returns the RoutePath observable from the current injector
 *
 * @returns RoutePath
 */
export function getRoutePath<T extends string = string>(): Observable<T> {
  return inject<RoutePath<T>>(RoutePath);
}

/**
 * Returns the RoutePath observable from the current injector
 *
 * @returns RouteParams
 */
export function getRouteParams<T extends Params = Params>(): Observable<T> {
  return inject<RouteParams<T>>(RouteParams);
}

/**
 * Returns the QueryParams observable from the current injector
 *
 * @returns QueryParams
 */
export function getQueryParams<T extends Params = Params>(): Observable<T> {
  return inject<QueryParams<T>>(QueryParams);
}
