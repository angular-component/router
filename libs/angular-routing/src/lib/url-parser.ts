import { Injectable } from '@angular/core';

@Injectable()
export class UrlParser {
  parse(url: string, base?: string | URL): URL {
    return new URL(url, base);
  }
}
