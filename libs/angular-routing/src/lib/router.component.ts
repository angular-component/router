import { Component, SkipSelf, Optional } from '@angular/core';
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
import { Params } from './route-params.service';

@Component({
  selector: 'router',
  template: '<ng-content></ng-content>',
})
export class RouterComponent {
  private destroy$ = new Subject();

  private _activeRoute$ = new BehaviorSubject<ActiveRoute>(null);
  readonly activeRoute$ = this._activeRoute$.pipe(distinctUntilChanged());

  private _routes$ = new BehaviorSubject<Route[]>([]);
  readonly routes$ = this._routes$.pipe(
    scan((routes, route) => {
      routes = routes.concat(route);

      return routes;
    })
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
    combineLatest(this.routes$.pipe(debounceTime(1)), this.router.url$)
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
            this.setActiveRoute({ route: null, params: {} });
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  findRouteMatch(route: Route, url: string) {
    let matchedRoute = route.matcher ? route.matcher.exec(url) : null;

    if (matchedRoute) {
      return matchedRoute;
    }

    return null;
  }

  setRoute(url: string, route: Route) {
    const pathInfo = match(this.normalizePath(route.path))(url);
    this.basePath = route.path;

    const routeParams: Params = pathInfo ? pathInfo.params : {};
    this.setActiveRoute({ route, params: routeParams || {} });
  }

  registerRoute(route: Route) {
    const normalizedPath = this.normalizePath(route.path);
    const routeRegex = pathToRegexp(normalizedPath);
    route.matcher = route.matcher || routeRegex;
    this._routes$.next([route]);

    return route;
  }

  setActiveRoute(active: ActiveRoute) {
    this._activeRoute$.next(active);
  }

  normalizePath(path: string) {
    let normalizedPath = this.location.normalize(path);

    if (normalizedPath === '**') {
      return '/(.*)';
    }

    normalizedPath = normalizedPath.replace('/**', '(.*)');

    return normalizedPath;
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
