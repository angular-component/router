import { NgModule, ModuleWithProviders } from '@angular/core';
import {
  LocationStrategy,
  PathLocationStrategy,
  CommonModule,
} from '@angular/common';

import { RouterComponent } from './router.component';
import { RouteComponent } from './route.component';
import { RouteComponentTemplate } from './route-component.directive';
import { LinkActive } from './link-active';
import { LinkTo } from './link.component';
import { UrlParser } from './url-parser';
import { QueryParams } from './route-params.service';
import { Router } from './router.service';

const components = [
  RouterComponent,
  RouteComponent,
  LinkActive,
  LinkTo,
  RouteComponentTemplate,
];

export function getQueryParams(router: Router) {
  return router.queryParams$;
}

@NgModule({
  imports: [CommonModule],
  declarations: [components],
  exports: [components],
})
export class RouterModule {
  static forRoot(): ModuleWithProviders<RouterModule> {
    return {
      ngModule: RouterModule,
      providers: [
        UrlParser,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: QueryParams, deps: [Router], useFactory: getQueryParams },
      ],
    };
  }
}
