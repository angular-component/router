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
} from '@angular/core';

import { Subject, BehaviorSubject, merge, of, from } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  takeUntil,
  mergeMap,
  withLatestFrom,
} from 'rxjs/operators';

import { Load, Route, RouteOptions } from './route';
import { Params, RouteParams } from './route-params.service';
import { RouterComponent } from './router.component';
import { Router } from './router.service';

export function getRouteParams(routeComponent: RouteComponent) {
  return routeComponent.routeParams$;
}

@Component({
  selector: 'route',
  template: `
    <ng-container *ngIf="(shouldRender$ | async) && template">
      <ng-container [ngTemplateOutlet]="template"></ng-container>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: RouteParams,
      useFactory: getRouteParams,
      deps: [[new Self(), RouteComponent]],
    },
  ],
})
export class RouteComponent implements OnInit, OnDestroy {
  @ContentChild(TemplateRef) template: TemplateRef<any> | null;
  @Input() path: string;
  @Input() component: Type<any>;
  @Input() load: Load;
  @Input() reuse = true;
  @Input() redirectTo!: string;
  @Input() exact: boolean;
  @Input() routeOptions: RouteOptions;

  private destroy$ = new Subject();
  private _routeParams$ = new BehaviorSubject<Params>({});
  private _shouldRender$ = new BehaviorSubject<boolean>(false);

  readonly shouldRender$ = this._shouldRender$.asObservable();
  readonly routeParams$ = this._routeParams$.pipe(takeUntil(this.destroy$));
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

    const activeRoute$ = this.routerComponent.activeRoute$.pipe(
      filter((ar) => ar !== null),
      distinctUntilChanged(),
      withLatestFrom(this.shouldRender$),
      mergeMap(([current, rendered]) => {
        if (current.route === this.route) {
          this._routeParams$.next(current.params);

          if (this.redirectTo) {
            this.router.go(this.redirectTo);
            return of(null);
          }

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
      })
    );

    merge(activeRoute$).pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
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
    this.viewContainerRef.createComponent(
      componentFactory,
      this.viewContainerRef.length,
      this.viewContainerRef.injector
    );
  }

  private clearComponent() {
    this.viewContainerRef.clear();
    this.hideTemplate();
  }

  private showTemplate() {
    setTimeout(() => {
      this._shouldRender$.next(true);
    });
  }

  private hideTemplate() {
    this._shouldRender$.next(false);
  }

  private clearView() {
    if (this.load) {
      this.clearComponent();
    } else {
      this.hideTemplate();
    }
  }
}
