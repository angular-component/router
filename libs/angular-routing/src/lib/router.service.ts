import { Injectable } from '@angular/core';
import { PlatformLocation, Location } from '@angular/common';

import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import * as queryString from 'query-string';

import { UrlParser } from './url-parser';
import { Params } from './route-params.service';

@Injectable({
  providedIn: 'root',
})
export class Router {
  private _url$ = new BehaviorSubject<string>(this.location.path());
  readonly url$ = this._url$.pipe(distinctUntilChanged());

  private _queryParams$ = new BehaviorSubject<Params>({});
  readonly queryParams$ = this._queryParams$.pipe(distinctUntilChanged());

  private _hash$ = new BehaviorSubject('');
  readonly hash$ = this._hash$.pipe(distinctUntilChanged());

  constructor(
    private location: Location,
    private platformLocation: PlatformLocation,
    private urlParser: UrlParser
  ) {
    this.location.subscribe(() => {
      this.nextState(this.getLocation());
    });

    this.nextState(this.getLocation());
  }

  go(url: string, queryParams?: Params, hash?: string) {
    this.location.go(this.serializeUrl(url, queryParams, hash));

    this.nextState(this.getLocation());
  }

  replace(url: string, queryParams?: Params, hash?: string) {
    this.location.replaceState(this.serializeUrl(url, queryParams, hash));

    this.nextState(this.getLocation());
  }

  serializeUrl(url: string, queryParams?: Params, hash?: string) {
    return (
      url +
      (queryParams ? `?${queryString.stringify(queryParams)}` : '') +
      `${hash ? '#' + hash : ''}`
    );
  }

  getExternalUrl(url: string) {
    return this.location.prepareExternalUrl(url);
  }

  private getLocation() {
    return this.platformLocation.href;
  }

  private nextState(url: string) {
    const parsedUrl = this._parseUrl(url);
    this._nextUrl(parsedUrl.pathname);
    this._nextQueryParams(this.parseSearchParams(parsedUrl.searchParams));
    this._nextHash(parsedUrl.hash ? parsedUrl.hash.split('#')[0] : '');
  }

  parseSearchParams(searchParams: URLSearchParams) {
    let queryParams: Params = {};

    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    return queryParams;
  }

  private _parseUrl(path: string): URL {
    return this.urlParser.parse(path);
  }

  private _nextUrl(url: string) {
    this._url$.next(url);
  }

  private _nextQueryParams(params: Params) {
    this._queryParams$.next(params);
  }

  private _nextHash(hash: string) {
    this._hash$.next(hash);
  }
}
