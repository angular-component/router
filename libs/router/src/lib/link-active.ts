import {
  AfterContentInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
  Optional,
  Inject,
  ContentChildren,
  EventEmitter
} from '@angular/core';
import { LinkTo } from './link.component';
import { Router } from './router.service';
import { from, Subject, Subscription, EMPTY, of, merge, combineLatest } from 'rxjs';
import { mergeAll, map, withLatestFrom, takeUntil, startWith, switchMapTo, mapTo, mergeMap, tap, combineAll, toArray, switchMap, switchAll } from 'rxjs/operators';

export interface LinkActiveOptions {
  exact: boolean;
}

export const LINK_ACTIVE_OPTIONS: LinkActiveOptions = {
  exact: true
};

/**
 * The LinkActive directive toggles classes on elements that contain an active linkTo directive
 *
 * <a linkActive="active" linkTo="/home/page">Home Page</a>
 * <ol>
 *  <li linkActive="active" *ngFor="var link of links">
 *    <a [linkTo]="'/link/' + link.id">{{ link.title }}</a>
 *  </li>
 * </ol>
 */
@Directive({ selector: '[linkActive]' })
export class LinkActive implements AfterContentInit, OnDestroy {
  @ContentChildren(LinkTo, { descendants: true }) public links: QueryList<LinkTo>;
  @Input('linkActive') activeClass: string = 'active';
  @Input() activeOptions: LinkActiveOptions;
  private _activeOptions: LinkActiveOptions = { exact: true };
  private _destroy$ = new Subject();
  private _linksSub!: Subscription;

  constructor(
    public element: ElementRef,
    public router: Router,
    public renderer: Renderer2,
    @Optional()
    @Inject(LINK_ACTIVE_OPTIONS)
    private defaultActiveOptions: LinkActiveOptions,
    @Optional() private link: LinkTo
  ) { }

  ngAfterContentInit() {
    if (this.defaultActiveOptions && !this.activeOptions) {
      this._activeOptions = this.defaultActiveOptions;
    } else if (this.activeOptions) {
      this._activeOptions = this.activeOptions;
    }

    this.links.changes.subscribe(() => this.collectLinks());
    this.collectLinks();
  }

  ngOnChanges() {
    this.collectLinks();
  }

  collectLinks() {
    if (this._linksSub) {
      this._linksSub.unsubscribe();
    }

    const contentLinks$ = this.links ? this.links.toArray().map(link => link.hrefUpdated.pipe(startWith(link.linkHref), mapTo(link.linkHref))) : [];
    const link$ = this.link ? this.link.hrefUpdated.pipe(startWith(this.link.linkHref), mapTo(this.link.linkHref)) : of('');
    const router$ = this.router.url$
      .pipe(
        map(path => this.router.getExternalUrl(path || '/')));

    const observables$ = [router$, link$, ...contentLinks$];

    this._linksSub = combineLatest(observables$).pipe(
      takeUntil(this._destroy$)
    ).subscribe(([path, link, ...links]) => {
      this.checkActive([...links, link], path);
    });
  }

  checkActive(linkHrefs: string[], path: string) {
    let active = linkHrefs.reduce((isActive, current) => {
      const [href] = current.split('?');

      if (this._activeOptions.exact) {
        isActive = isActive ? isActive : href === path;
      } else {
        isActive = isActive ? isActive : path.startsWith(href);
      }

      return isActive;
    }, false);

    this.updateClasses(active);
  }

  updateClasses(active: boolean) {
    let activeClasses = this.activeClass.split(' ');
    activeClasses.forEach((activeClass) => {
      if (active) {
        this.renderer.addClass(this.element.nativeElement, activeClass);
      } else {
        this.renderer.removeClass(this.element.nativeElement, activeClass);
      }
    });
  }

  ngOnDestroy() {
    this._destroy$.next();
  }
}
