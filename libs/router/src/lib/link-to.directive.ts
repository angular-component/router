import {
  Directive,
  HostBinding,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from './router.service';
import { Params } from './route-params.service';

const DEFAULT_TARGET = '_self';

/**
 * The LinkTo directive links to routes in your app
 *
 * Links are pushed to the `Router` service to trigger a route change.
 * Query params can be represented as an object or a string of names/values
 *
 * <a linkTo="/home/page" [queryParams]="{ id: 123 }">Home Page</a>
 * <a [linkTo]="'/pages' + page.id">Page 1</a>
 */
@Directive({ selector: 'a[linkTo]', standalone: true })
export class LinkTo {
  @Input() target = DEFAULT_TARGET;
  @HostBinding('href') linkHref?: string | null;

  @Input() set linkTo(href: string | null | undefined) {
    if (href === null || href === undefined) {
      return;
    }
    this._href = href;
    this._updateHref();
  }

  @Input() set queryParams(params: Params | null | undefined) {
    this._query = params;
    this._updateHref();
  }

  @Input() set fragment(hash: string | null | undefined) {
    this._hash = hash;
    this._updateHref();
  }

  @Output() hrefUpdated: EventEmitter<string> = new EventEmitter<string>();

  private _href: string;
  private _query: Params;
  private _hash: string;

  constructor(private router: Router) {}

  /**
   * Handles click events on the associated link
   * Prevents default action for non-combination click events without a target
   */
  @HostListener('click', ['$event'])
  onClick(event: any) {
    if (!this._href) {
      return;
    }
    if (!this._comboClick(event) && this.target === DEFAULT_TARGET) {
      this.router.go(this._href, this._query, this._hash);

      event.preventDefault();
    }
  }

  private _updateHref() {
    const href = this._cleanUpHref(this._href);

    this.linkHref = this.router.serializeUrl(href, this._query, this._hash);

    this.hrefUpdated.emit(this.linkHref);
  }

  /**
   * Determines whether the click event happened with a combination of other keys
   */
  private _comboClick(event) {
    const buttonEvent = event.which || event.button;

    return buttonEvent > 1 || event.ctrlKey || event.metaKey || event.shiftKey;
  }

  private _cleanUpHref(href: string = ''): string {
    // Trim whitespaces and remove trailing slashes
    return href.trim().replace(/(?!^)\/+$/, '');
  }
}
