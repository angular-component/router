import {
  Component,
  SkipSelf,
  Optional,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Location } from '@angular/common';
import { combineLatest, Subject, BehaviorSubject } from 'rxjs';
import {
  tap,
  takeUntil,
  distinctUntilChanged,
  scan,
  debounceTime,
} from 'rxjs/operators';

import { pathToRegexp, match } from 'path-to-regexp';

import { Route, ActiveRoute } from './route';
import { Router } from './router.service';
import { compareParams, Params } from './route-params.service';
import { compareRoutes } from './utils/compare-routes';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'router',
  template: '<ng-content></ng-content>',
})
export class RouterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  private _activeRoute$ = new BehaviorSubject<ActiveRoute>(null);
  readonly activeRoute$ = this._activeRoute$.pipe(
    distinctUntilChanged(this.compareActiveRoutes)
  );

  private _routes$ = new BehaviorSubject<Route[]>([]);
  readonly routes$ = this._routes$.pipe(
    scan((routes, route) => routes.concat(route).sort(compareRoutes))
  );

  public basePath = '';

  // support multiple "routers"
  // router (base /)
  // blog(.*?)
  // router (base /blog)
  // post1(blog/post1/(.*?)
  // post2
  // post3

  constructor(
    private router: Router,
    private location: Location,
    @SkipSelf() @Optional() public parentRouterComponent: RouterComponent
  ) {}

  ngOnInit() {
    combineLatest([this.routes$.pipe(debounceTime(1)), this.router.url$])
      .pipe(
        distinctUntilChanged(),
        tap(([routes, url]: [Route[], string]) => {
          let routeToRender = null;
          for (const route of routes) {
            routeToRender = this.findRouteMatch(route, url);

            if (routeToRender) {
              this.setRoute(url, route);
              break;
            }
          }

          if (!routeToRender) {
            this.setActiveRoute({ route: null, params: {}, path: '' });
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  findRouteMatch(route: Route, url: string) {
    const matchedRoute = route.matcher ? route.matcher.exec(url) : null;

    if (matchedRoute) {
      return matchedRoute;
    }

    return null;
  }

  setRoute(url: string, route: Route) {
    const pathInfo = match(this.normalizePath(route.path), {
      end: route.options.exact,
    })(url);
    this.basePath = route.path;

    const routeParams: Params = pathInfo ? pathInfo.params : {};
    const path: string = pathInfo ? pathInfo.path : '';
    this.setActiveRoute({ route, params: routeParams || {}, path });
  }

  registerRoute(route: Route) {
    const normalized = this.normalizePath(route.path);
    const routeRegex = pathToRegexp(normalized, [], {
      end: route.options.exact ?? true,
    });

    route.matcher = route.matcher || routeRegex;
    this._routes$.next([route]);

    return route;
  }

  setActiveRoute(active: ActiveRoute) {
    this._activeRoute$.next(active);
  }

  normalizePath(path: string) {
    return this.location.normalize(path);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private compareActiveRoutes(
    previous: ActiveRoute,
    current: ActiveRoute
  ): boolean {
    if (previous === current) {
      return true;
    }
    if (!previous) {
      return false;
    }
    return (
      previous.path === current.path &&
      compareParams(previous.params, current.params) &&
      previous.route.path === current.route.path &&
      previous.route.options.exact === current.route.options.exact
    );
  }
}
