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
import { Route, ActiveRoute } from './route';
import { Router } from './router.service';
import { compareParams } from './route-params.service';
import { compareRoutes } from './utils/compare-routes';
import { matchRoute, parsePath } from './utils/path-parser';

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
    distinctUntilChanged(this.compareRoutes),
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
            routeToRender = this.isRouteMatch(url, route);

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

  setRoute(url: string, route: Route) {
    this.basePath = route.path;
    const match = matchRoute(url, route);
    this.setActiveRoute({
      route,
      params: match?.params || {},
      path: match?.path || '',
    });
  }

  registerRoute(route: Route) {
    route.matcher = route.matcher || parsePath(route);
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

  private isRouteMatch(url: string, route: Route) {
    return route.matcher?.exec(url);
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

  private compareRoutes(previous: Route[], current: Route[]): boolean {
    if (previous === current) {
      return true;
    }
    if (!previous) {
      return false;
    }
    return (
      previous.length === current.length &&
      previous.every((route, i) => route[i] === current[i])
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
    } else {
      this.updateState({ routes: routes.concat(route).sort(compareRoutes) });
    }
  }
}
