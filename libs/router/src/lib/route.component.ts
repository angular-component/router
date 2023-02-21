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
  createNgModule,
} from '@angular/core';
import { computed, effect, signal } from '@angular-component/signals';

import { Load, ModuleWithRoute, Route, RouteOptions } from './route';
import { Params, RouteParams, RoutePath } from './route-params.service';
import { RouterComponent } from './router.component';
import { Router } from './router.service';

interface State {
  params: Params;
  path: string;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'route',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container
      *ngIf="shouldRender && template"
      [ngTemplateOutlet]="template"
    >
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: RouteParams,
      useFactory(routeComponent: RouteComponent) {
        return routeComponent.routeParams;
      },
      deps: [[new Self(), RouteComponent]],
    },
    {
      provide: RoutePath,
      useFactory(routeComponent: RouteComponent) {
        return routeComponent.routePath;
      },
      deps: [[new Self(), RouteComponent]],
    },
  ],
})
export class RouteComponent implements OnInit, OnDestroy {
  @ContentChild(TemplateRef) template!: TemplateRef<any> | null;

  @Input()
  get path() {
    return this._path;
  }

  set path(value: string) {
    this._path = this.sanitizePath(value);
  }

  @Input()
  component!: Type<any>;
  @Input()
  load?: Load;
  @Input() reuse = true;
  @Input() redirectTo!: string;
  @Input()
  exact!: boolean;
  @Input()
  routeOptions!: RouteOptions;

  private _path!: string;
  private readonly state = signal<State>({
    params: {},
    path: '',
  });
  protected shouldRender = false;

  readonly routeParams = computed(() => this.state().params);
  readonly routePath = computed(() => this.state().path);
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

    effect(() => {
      const ar = this.routerComponent.activeRoute();
      const rendered = this.shouldRender;

      if (ar?.route) {
        if (ar?.route === this.route) {
          if (this.redirectTo) {
            this.router.go(this.redirectTo);
          }

          this.updateState({
            params: ar.params,
            path: ar.path,
          });

          if (!rendered) {
            if (!this.reuse) {
              this.clearView();
            }

            this.loadAndRender(ar.route as Route);
          }
        } else if (rendered) {
          this.clearView();
        }
      }
    });
  }

  ngOnDestroy() {
    this.routerComponent.unregisterRoute(this.route);
  }

  registerRoute(path: string, exact: boolean, load?: Load) {
    return this.routerComponent.registerRoute({
      path: path,
      load: load,
      options: this.routeOptions || { exact: exact },
    });
  }

  private loadAndRender(route: Route) {
    if (route.load) {
      route
        .load()
        .then((componentOrModule: NgModuleRef<ModuleWithRoute> | Type<any>) => {
          let component: Type<any>;

          if ((componentOrModule as any).ɵmod) {
            const moduleRef: NgModuleRef<ModuleWithRoute> = createNgModule(
              componentOrModule as Type<any>,
              this.viewContainerRef.injector
            );
            component = moduleRef.instance.routeComponent;
          } else {
            component = componentOrModule as Type<any>;
          }

          this.renderComponent(component);
        });
    } else {
      this.showTemplate();
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
    console.log(this.template)
    this.shouldRender = true;
  }

  private hideTemplate() {
    this.shouldRender = false;
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
    this.state.update((state) => ({ ...state, ...newState }));
  }
}
