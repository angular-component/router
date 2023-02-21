import {
  Component,
  SkipSelf,
  Optional,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Route, ActiveRoute } from './route';
import { Router } from './router.service';
import { compareParams } from './route-params.service';
import { compareRoutes } from './utils/compare-routes';
import { matchRoute, parsePath } from './utils/path-parser';
import { computed, signal, effect } from '@angular-component/signals';

interface State {
  routes: Route[];
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'router',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class RouterComponent implements OnInit, OnDestroy {
  public activeRoute = signal<ActiveRoute | null>(null);
  private readonly state = signal<State>({
    routes: [],
  });

  readonly routes = computed(() => this.state().routes);

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
    effect(() => {
      const routes = this.routes();
      const url = this.router.url();

      let routeToRender = null;
      for (const route of routes) {
        routeToRender = this.isRouteMatch(url, route);

        if (routeToRender) {     
          this.setRoute(url, route);
          break;
        }
      }

      if (!routeToRender) {
        this.setActiveRoute({ route: null, params : {}, path: '' });
      }
    });
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
    this.activeRoute.update(() => activeRoute);
  }

  unregisterRoute(route: Route) {
    this.updateRoutes(route);
  }

  normalizePath(path: string) {
    return this.router.normalizePath(path);
  }

  ngOnDestroy() {
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
      previous.route === current.route
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
      previous.every((route, i) => route === current[i])
    );
  }

  private updateState(newState: Partial<State>) {
    this.state.update((state) => ({ ...state, ...newState }));
  }

  private updateRoutes(route: Route) {
    const routes = this.state().routes;
    const index = routes.indexOf(route);
    if (index > -1) {
      this.updateState({
        routes: [...routes.slice(0, index), ...routes.slice(index + 1)],
      });
    } else {
      this.updateState({ routes: routes.concat(route).sort(compareRoutes) });
    }
  }
}
