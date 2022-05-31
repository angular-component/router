import { inject, InjectFlags, ProviderToken, Type } from '@angular/core';
import { Observable } from 'rxjs';

import { Params } from './route-params.service';

/**
 * The arguments passed to LoaderFunction.
 */
export interface DataFunctionArgs {
  path: string;
  params: Params;
  parent?: any;
  get: <T>(token: ProviderToken<T>, defaultValue?: T, flags?: InjectFlags) => T;
}

/**
 * Data for a route that was returned from a `loader()`.
 */
export type AppData = any;

/**
 * A function that loads data for a route.
 */
export interface LoaderFunction {
  (args?: DataFunctionArgs):
    | Promise<Response>
    | Response
    | Promise<AppData>
    | AppData;
}

export class LoaderData<T extends AppData = AppData> extends Observable<T> {}

/**
 * Returns the LoaderData observable from the current injector
 *
 * @returns Observable<QueryParams>
 */
export function getLoaderData<T extends AppData = AppData>(): Observable<T> {
  return inject<LoaderData<T>>(LoaderData);
}
