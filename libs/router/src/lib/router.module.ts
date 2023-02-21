import { LocationStrategy, PathLocationStrategy } from '@angular/common';

import { RouterComponent } from './router.component';
import { RouteComponent } from './route.component';
import { RouteComponentTemplate } from './route-component.directive';
import { UrlParser } from './url-parser';
import { QueryParams } from './route-params.service';
import { Router } from './router.service';
import { LinkTo } from './link-to.directive';

export const ROUTER_COMPONENTS = [
  RouterComponent,
  RouteComponent,
  RouteComponentTemplate,
  LinkTo,
];

export function provideComponentRouter() {
  return [
    UrlParser,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: QueryParams,
      deps: [Router],
      useFactory(router: Router) {
        return router.queryParams;
      },
    },
  ];
}
