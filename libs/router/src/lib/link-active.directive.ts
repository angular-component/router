import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  QueryList,
  Renderer2,
} from '@angular/core';
import { LinkTo } from './link-to.directive';
import { Router } from './router.service';
import { combineLatest, of, Subject, Subscription } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { filterNullable } from './operators/filter-nullable.operator';

export interface LinkActiveOptions {
  exact: boolean;
}

export const LINK_ACTIVE_OPTIONS: LinkActiveOptions = {
  exact: true,
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
@Directive({ selector: '[linkActive]', standalone: true })
export class LinkActive implements AfterContentInit, OnDestroy, OnChanges {
  @ContentChildren(LinkTo, { descendants: true })
  public links: QueryList<LinkTo>;
  @Input('linkActive') activeClass: string | null = 'active';
  @Input() activeOptions?: LinkActiveOptions | null;
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
  ) {}

  ngAfterContentInit() {
    if (this.defaultActiveOptions && !this.activeOptions) {
      this._activeOptions = this.defaultActiveOptions;
    } else if (this.activeOptions) {
      this._activeOptions = this.activeOptions;
    }

    this.links.changes
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.collectLinks());
    this.collectLinks();
  }

  ngOnChanges() {
    this.collectLinks();
  }

  collectLinks() {
    if (this._linksSub) {
      this._linksSub.unsubscribe();
    }

    const contentLinks$ = this.links
      ? this.links.toArray().map((link) =>
          link.hrefUpdated.pipe(
            startWith(link.linkHref),
            map(() => link.linkHref),
            filterNullable()
          )
        )
      : [];

    const link$ = this.link
      ? this.link.hrefUpdated.pipe(
          startWith(this.link.linkHref),
          map(() => this.link.linkHref),
          filterNullable()
        )
      : of('');

    const router$ = this.router.url$.pipe(
      map((path) => this.router.getExternalUrl(path || '/'))
    );

    const observables$ = [router$, link$, ...contentLinks$];

    this._linksSub = combineLatest(observables$)
      .pipe(takeUntil(this._destroy$))
      .subscribe(([path, link, ...links]) => {
        this.checkActive([...links, link], path);
      });
  }

  checkActive(linkHrefs: string[], path: string) {
    const active = linkHrefs.reduce((isActive, current) => {
      const [href] = current.split('?');
      if (this._activeOptions.exact) {
        return isActive ? isActive : href === path;
      }
      return isActive ? isActive : path.startsWith(href);
    }, false);

    this.updateClasses(active);
  }

  updateClasses(active: boolean) {
    const activeClasses = this.activeClass.split(' ');
    activeClasses.forEach((activeClass) => {
      if (active) {
        this.renderer.addClass(this.element.nativeElement, activeClass);
      } else {
        this.renderer.removeClass(this.element.nativeElement, activeClass);
      }
    });
  }

  ngOnDestroy() {
    this._destroy$.next(true);
  }
}
