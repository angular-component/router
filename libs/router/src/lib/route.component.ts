import {
  Component,
  OnInit,
  Input,
  Type,
  ViewContainerRef,
  ComponentFactoryResolver,
  ContentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  Self,
  NgModuleFactory,
  Compiler,
  OnDestroy,
  Output,
  EventEmitter,
  ComponentRef,
} from '@angular/core';

import { Subject, BehaviorSubject, of, from } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  takeUntil,
  mergeMap,
  withLatestFrom,
  map,
} from 'rxjs/operators';

import { Load, Route, RouteOptions } from './route';
import { Params, RouteParams, RoutePath } from './route-params.service';
import { RouterComponent } from './router.component';
import { Router } from './router.service';

export function getRouteParams(routeComponent: RouteComponent) {
  return routeComponent.routeParams$;
}

export function getRoutePath(routeComponent: RouteComponent) {
  return routeComponent.routePath$;
}

interface State {
  params: Params;
  path: string;
  shouldRender: boolean;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'route',
  template: `
    <ng-container
      *ngIf="(shouldRender$ | async) && template"
      [ngTemplateOutlet]="template"
    >
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: RouteParams,
      useFactory: getRouteParams,
      deps: [[new Self(), RouteComponent]],
    },
    {
      provide: RoutePath,
      useFactory: getRoutePath,
      deps: [[new Self(), RouteComponent]],
    },
  ],
})
export class RouteComponent implements OnInit, OnDestroy {
  @ContentChild(TemplateRef) template: TemplateRef<any> | null;

  @Input()
  get path() {
    return this._path;
  }

  set path(value: string) {
    this._path = this.sanitizePath(value);
  }

  @Input() component: Type<any>;
  @Input() load: Load;
  @Input() reuse = true;
  @Input() redirectTo!: string;
  @Input() exact: boolean;
  @Input() routeOptions: RouteOptions;
  @Output() routeRendered = new EventEmitter<{
    route: Route;
    componentRef: ComponentRef<any>;
  }>();
  @Output() routeDestroyed = new EventEmitter<Route>();

  private _path: string;
  private destroy$ = new Subject();
  private readonly state$ = new BehaviorSubject<State>({
    params: {},
    path: '',
    shouldRender: false,
  });

  readonly shouldRender$ = this.state$.pipe(map((state) => state.shouldRender));
  readonly routeParams$ = this.state$.pipe(
    map((state) => state.params),
    distinctUntilChanged(),
    takeUntil(this.destroy$)
  );
  readonly routePath$ = this.state$.pipe(
    map((state) => state.path),
    distinctUntilChanged(),
    takeUntil(this.destroy$)
  );
  route!: Route;

  constructor(
    private router: Router,
    private routerComponent: RouterComponent,
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private compiler: Compiler
  ) {}

  ngOnInit(): void {
    // account for root level routes, don't add the basePath
    const path = this.routerComponent.parentRouterComponent
      ? this.routerComponent.parentRouterComponent.basePath + this.path
      : this.path;

    this.route = this.registerRoute(path, this.exact, this.load);

    this.routerComponent.activeRoute$
      .pipe(
        filter((ar) => ar !== null),
        distinctUntilChanged(),
        withLatestFrom(this.shouldRender$),
        mergeMap(([current, rendered]) => {
          if (current.route === this.route) {
            if (this.redirectTo) {
              this.router.go(this.redirectTo);
              return of(null);
            }

            this.updateState({
              params: current.params,
              path: current.path,
            });

            if (!rendered) {
              if (!this.reuse) {
                this.clearView();
              }

              return this.loadAndRender(current.route);
            }

            return of(null);
          } else if (rendered) {
            return of(this.clearView());
          }

          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.routerComponent.unregisterRoute(this.route);
    this.routeDestroyed.emit(this.route);
    this.destroy$.next();
  }

  registerRoute(path: string, exact: boolean, load: Load) {
    return this.routerComponent.registerRoute({
      path: path,
      load: load,
      options: this.routeOptions || { exact: exact },
    });
  }

  private loadAndRender(route: Route) {
    if (route.load) {
      return from(
        route.load().then((componentOrModule) => {
          if (componentOrModule instanceof NgModuleFactory) {
            const moduleRef = componentOrModule.create(
              this.viewContainerRef.injector
            );
            const component = moduleRef.instance.routeComponent;

            this.renderComponent(component);
          } else if (componentOrModule.ɵmod) {
            return this.compiler
              .compileModuleAsync(componentOrModule as Type<any>)
              .then((moduleFactory) => {
                const moduleRef = moduleFactory.create(
                  this.viewContainerRef.injector
                );
                const component = moduleRef.instance.routeComponent;
                this.renderComponent(component);

                return true;
              });
          } else {
            this.renderComponent(componentOrModule);
          }

          return true;
        })
      );
    } else {
      this.showTemplate();
      return of(true);
    }
  }

  private renderComponent(component: Type<any>) {
    const componentFactory = this.resolver.resolveComponentFactory(component);

    this.showTemplate();
    const componentRef = this.viewContainerRef.createComponent(
      componentFactory,
      this.viewContainerRef.length,
      this.viewContainerRef.injector
    );
    this.routeRendered.emit({ route: this.route, componentRef });
  }

  private clearComponent() {
    this.viewContainerRef.clear();
    this.hideTemplate();
  }

  private showTemplate() {
    setTimeout(() => {
      this.updateState({ shouldRender: true });
    });
  }

  private hideTemplate() {
    this.updateState({ shouldRender: false });
  }

  private clearView() {
    if (this.load) {
      this.clearComponent();
    } else {
      this.hideTemplate();
    }
  }

  private sanitizePath(path: string): string {
    const trimmed = path.trim();
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  private updateState(newState: Partial<State>) {
    this.state$.next({ ...this.state$.value, ...newState });
  }
}
