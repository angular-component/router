import { NgModule, ModuleWithProviders } from '@angular/core';
import {
  LocationStrategy,
  PathLocationStrategy,
  CommonModule,
} from '@angular/common';

import { RouterComponent } from './router.component';
import { RouteComponent } from './route.component';
import { RouteComponentTemplate } from './route-component.directive';
import { LinkActive } from './link-active.directive';
import { LinkTo } from './link-to.directive';
import { UrlParser } from './url-parser';
import { QueryParams } from './route-params.service';
import { Router } from './router.service';

export const components = [
  RouterComponent,
  RouteComponent,
  LinkActive,
  LinkTo,
  RouteComponentTemplate,
];

export function provideComponentRouter() {
  return [
    UrlParser,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: QueryParams,
      deps: [Router],
      useFactory(router: Router) {
        return router.queryParams$;
      },
    },
  ];
}

@NgModule({
  imports: [CommonModule, components],
  exports: [components],
})
export class ComponentRouterModule {
  static forRoot(): ModuleWithProviders<ComponentRouterModule> {
    return {
      ngModule: ComponentRouterModule,
      providers: [provideComponentRouter()],
    };
  }
}
