import { Injectable } from '@angular/core';

@Injectable()
export class UrlParser {
  parse(url: string, base?: string | URL): URL {
    if (base) {
      return new URL(url, base);
    }
    return new URL(url);
  }

  joinUrls(currentUrl: string, url: string): string {
    const currentUrlSegments = currentUrl
      .split('#')[0] // remove hash
      .split('?')[0] // remove query params
      .split('/');
    const urlSegments = url.split('/');

    return urlSegments
      .reduce((segments, segment) => {
        if (segment === '.') {
          return segments;
        }
        if (segment === '..') {
          return segments.slice(0, -1);
        }
        return [...segments, segment];
      }, currentUrlSegments)
      .join('/');
  }
}
