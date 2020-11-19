import {
  Component,
  SkipSelf,
  Optional,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { combineLatest, Subject, BehaviorSubject } from 'rxjs';
import {
  tap,
  takeUntil,
  distinctUntilChanged,
  debounceTime,
  map,
} from 'rxjs/operators';

import { pathToRegexp, match } from 'path-to-regexp';

import { Route, ActiveRoute } from './route';
import { Router } from './router.service';
import { compareParams, Params } from './route-params.service';
import { compareRoutes } from './utils/compare-routes';

interface State {
  activeRoute: ActiveRoute | null;
  routes: Route[];
}

type UnregisterableRoute = Route & { unregister?: boolean };

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'router',
  template: '<ng-content></ng-content>',
})
export class RouterComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  private readonly state$ = new BehaviorSubject<State>({
    activeRoute: null,
    routes: [],
  });

  readonly activeRoute$ = this.state$.pipe(
    map((state) => state.activeRoute),
    distinctUntilChanged(this.compareActiveRoutes),
    takeUntil(this.destroy$)
  );
  readonly routes$ = this.state$.pipe(
    map((state) => state.routes),
    takeUntil(this.destroy$)
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
    this.updateRoutes(route);

    return route;
  }

  setActiveRoute(activeRoute: ActiveRoute) {
    this.updateState({ activeRoute });
  }

  unregisterRoute(route: Route) {
    this.updateRoutes({ ...route, unregister: true });
  }

  normalizePath(path: string) {
    return this.router.normalizePath(path);
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

  private updateState(newState: Partial<State>) {
    this.state$.next({ ...this.state$.value, ...newState });
  }

  private updateRoutes(route: UnregisterableRoute) {
    const routes = this.state$.value.routes;
    if (route.unregister) {
      this.updateState({
        routes: routes.filter((r) => r.matcher !== route.matcher),
      });
    }
    this.updateState({ routes: routes.concat(route).sort(compareRoutes) });
  }
}
