import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Type,
  ViewContainerRef,
  ContentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  Self,
  OnDestroy,
  NgModuleRef,
  createNgModuleRef,
  NgModule,
  isDevMode,
} from '@angular/core';

import { Subject, BehaviorSubject, of, from, asyncScheduler } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  takeUntil,
  mergeMap,
  withLatestFrom,
  map,
} from 'rxjs/operators';
import { AppData, LoaderData, LoaderFunction } from './data';

import { Load, ModuleWithRoute, Route, RouteOptions } from './route';
import { Params, RouteParams, RoutePath } from './route-params.service';
import { RouterComponent } from './router.component';
import { Router } from './router.service';

interface State {
  params: Params;
  path: string;
  shouldRender: boolean;
  loaderData?: AppData;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'route',
  standalone: true,
  imports: [CommonModule],
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
      useFactory(routeComponent: RouteComponent) {
        return routeComponent.routeParams$;
      },
      deps: [[new Self(), RouteComponent]],
    },
    {
      provide: RoutePath,
      useFactory(routeComponent: RouteComponent) {
        return routeComponent.routePath$;
      },
      deps: [[new Self(), RouteComponent]],
    },
    {
      provide: LoaderData,
      useFactory(routeComponent: RouteComponent) {
        return routeComponent.loaderData$;
      },
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
  @Input() loader!: LoaderFunction;

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
  readonly loaderData$ = this.state$.pipe(
    map((state) => state.loaderData),
    distinctUntilChanged(),
    takeUntil(this.destroy$)
  );

  route!: Route;

  constructor(
    private router: Router,
    private routerComponent: RouterComponent,
    private viewContainerRef: ViewContainerRef
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
        mergeMap(async ([current, rendered]) => {
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

              if (this.loader) {
                const loaderData = await this.loader({
                  params: current.params,
                  path: current.path,
                });
                this.updateState({
                  loaderData,
                });
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
    this.destroy$.next(true);
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
        route.load().then((componentOrModule: NgModule | Type<any>) => {
          if (componentOrModule['default']) {
            componentOrModule = componentOrModule['default'];
          }

          this.checkMetadata(componentOrModule);
          let component: Type<any>;

          if ((componentOrModule as any).ɵmod) {
            const moduleRef: NgModuleRef<ModuleWithRoute> = createNgModuleRef(
              componentOrModule as Type<any>,
              this.viewContainerRef.injector
            );
            component = moduleRef.instance.routeComponent;
          } else {
            component = componentOrModule as Type<any>;
          }

          this.renderComponent(component);
        })
      );
    } else {
      this.showTemplate();
      return of(true);
    }
  }

  private renderComponent(component: Type<any>) {
    this.showTemplate();

    this.viewContainerRef.createComponent(component, {
      index: this.viewContainerRef.length,
      injector: this.viewContainerRef.injector,
    });
  }

  private clearComponent() {
    this.viewContainerRef.clear();
    this.hideTemplate();
  }

  private showTemplate() {
    asyncScheduler.schedule(() => {
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

  private checkMetadata(componentOrModule: any) {
    if (isDevMode()) {
      if (!componentOrModule.ɵmod && !componentOrModule.ɵcmp) {
        console.warn(
          `@angular-component/router: An invalid import ` +
            `for ${this.route.path} was lazy loaded. ` +
            `Either export the component as a default export ` +
            `or use .then(m => m.ComponentClass) to unwrap the ` +
            `import.`
        );
      }
    }
  }
}
