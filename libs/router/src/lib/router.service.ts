import { inject, Injectable } from '@angular/core';
import { PlatformLocation, Location } from '@angular/common';
import { signal } from '@angular-component/signals';

import { UrlParser } from './url-parser';
import { Params } from './route-params.service';

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

  readonly url = signal(this.location.path());
  readonly hash = signal('');
  readonly queryParams = signal<Params>({});

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

    this.url.update(() => parsedUrl.pathname);
    this.queryParams.update(() => this.parseSearchParams(parsedUrl.searchParams));
    this.hash.update(() => parsedUrl.hash ? parsedUrl.hash.split('#')[1] : '');
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
