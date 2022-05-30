import { inject, Injectable } from '@angular/core';
import { PlatformLocation, Location } from '@angular/common';

import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { UrlParser } from './url-parser';
import { Params, compareParams } from './route-params.service';

interface State {
  url: string;
  queryParams: Params;
  hash: string;
}

@Injectable({
  providedIn: 'root',
})
export class Router {
  private location = inject(Location);
  private platformLocation = inject(PlatformLocation);
  private urlParser = inject(UrlParser);

  private readonly state$ = new BehaviorSubject<State>({
    url: this.location.path(),
    queryParams: {},
    hash: '',
  });

  readonly url$ = this.state$.pipe(
    map((state) => state.url),
    distinctUntilChanged()
  );
  readonly hash$ = this.state$.pipe(
    map((state) => state.hash),
    distinctUntilChanged()
  );
  readonly queryParams$ = this.state$.pipe(
    map((state) => state.queryParams),
    distinctUntilChanged(compareParams)
  );

  constructor() {
    this.location.subscribe(() => {
      this.nextState(this.getLocation());
    });

    this.nextState(this.getLocation());
  }

  forward() {
    this.location.forward();
    this.nextState(this.getLocation());
  }

  back() {
    this.location.back();
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
    // if relative path
    if (!url.startsWith('/')) {
      url = this.urlParser.joinUrls(this.location.path(), url);
    }

    return (
      url +
      (queryParams ? `?${this.stringifyQueryParams(queryParams)}` : '') +
      `${hash ? '#' + hash : ''}`
    );
  }

  getExternalUrl(url: string) {
    return this.location.prepareExternalUrl(url);
  }

  parseSearchParams(params: string | URLSearchParams) {
    const searchParams = new URLSearchParams(params);
    const queryParams: Params = {};

    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    return queryParams;
  }

  normalizePath(path: string) {
    return this.location.normalize(path);
  }

  private getLocation() {
    return this.platformLocation.href;
  }

  private nextState(url: string) {
    const parsedUrl = this._parseUrl(url);

    this.state$.next({
      url: parsedUrl.pathname,
      queryParams: this.parseSearchParams(parsedUrl.searchParams),
      hash: parsedUrl.hash ? parsedUrl.hash.split('#')[1] : '',
    });
  }

  private _parseUrl(path: string): URL {
    return this.urlParser.parse(path);
  }

  private stringifyQueryParams(params: Params) {
    return new URLSearchParams(params).toString();
  }
}

/**
 * Returns the Router instance from the current injector
 *
 * @returns Router
 */
export function getRouter() {
  return inject(Router);
}
