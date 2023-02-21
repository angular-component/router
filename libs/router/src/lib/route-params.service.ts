import { inject, InjectionToken } from '@angular/core';
import { Signal } from '@angular-component/signals';

export interface Params {
  [param: string]: any;
}

export const RoutePath = new InjectionToken<Signal<string>>('Route Path');

export const RouteParams = new InjectionToken<Signal<Params>>('Route Params');

export const QueryParams = new InjectionToken<Signal<Params>>('Query Params');

export function compareParams(previous: Params, current: Params): boolean {
  return (
    previous === current || JSON.stringify(previous) === JSON.stringify(current)
  );
}

/**
 * Returns the RoutePath signal from the current injector
 *
 * @returns RoutePath
 */
export function getRoutePath<T>(): Signal<T> {
  return inject<Signal<T>>(RoutePath);
}

/**
 * Returns the RoutePath signal from the current injector
 *
 * @returns RouteParams
 */
export function getRouteParams<T>(): Signal<T> {
  return inject<Signal<T>>(RouteParams);
}

/**
 * Returns the QueryParams signal from the current injector
 *
 * @returns QueryParams
 */
export function getQueryParams<T>(): Signal<T> {
  return inject<Signal<T>>(QueryParams);
}
