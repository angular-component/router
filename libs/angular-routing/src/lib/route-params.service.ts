import { Observable } from 'rxjs';

export interface Params {
  [param: string]: any;
}

export class RoutePath<T extends string = string> extends Observable<T> {}

export class RouteParams<T extends Params = Params> extends Observable<T> {}

export class QueryParams<T extends Params = Params> extends Observable<T> {}
