# Angular Routing

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![npm version](https://img.shields.io/npm/v/angular-routing.svg)](https://www.npmjs.com/package/angular-routing)

A declarative router for Angular applications.

## Install

Use your package manager of choice to install the package.

```sh
npm install angular-routing
```

OR

```sh
yarn add angular-routing
```

## Installation with ng add

You can use ng add to install the package by using the command below.

```sh
ng add angular-routing
```

The above command will install the package, and add the RoutingModule import in the AppModule.

## Usage

To register the Router, add the `RoutingModule.forRoot()` to your AppModule imports.

```ts
import { RoutingModule } from 'angular-routing';

@NgModule({
  imports: [
    // ... other imports
    RoutingModule.forRoot(),
  ],
})
export class AppModule {}
```

Or in a feature module

```ts
import { RoutingModule } from 'angular-routing';

@NgModule({
  imports: [
    // ... other imports
    RoutingModule,
  ],
})
export class FeatureModule {}
```

After your components are registered, use the `Router` and `Route` components to register some routes.

```html
<router>
  <!-- For nested routes use exact: false -->
  <route path="/blog" [exact]="false">
    <app-blog *routeComponent></app-blog>
  </route>
  <route path="/posts/:postId">
    <app-post *routeComponent></app-post>
  </route>
  <route path="/about">
    <app-about *routeComponent></app-about>
  </route>
  <route path="/" redirectTo="/blog"> </route>
  <route path="/" [exact]="false">
    <app-page-not-found *routeComponent></app-page-not-found>
  </route>
</router>
```

## Route sorting

Angular routing is sorting the routes upon registration, based on priority. The order in which the routes are defined in your template is therefore not important.

The following two examples will give the same results

```html
<router>
  <route path="/blog" [exact]="false">
    <app-blog *routeComponent></app-blog>
  </route>
  <route path="/" redirectTo="/blog"></route>
  <route path="/" [exact]="false">
    <app-page-not-found *routeComponent></app-page-not-found>
  </route>
</router>
```

and

```html
<router>
  <route path="/" [exact]="false">
    <app-page-not-found *routeComponent></app-page-not-found>
  </route>
  <route path="/" redirectTo="/blog"></route>
  <route path="/blog" [exact]="false">
    <app-blog *routeComponent></app-blog>
  </route>
</router>
```

The sorting algorithm has only a few rules (ordered by importance):

- Named routes (e.g. `/blog`) have priority over root route (`/`)
- Static routes (e.g. `/blog/view`) have priority over parametrized (e.g. `/blog/:id`)
- Exact route (with `exact` set to `true` or omitted) has priority over non-exact (with `exact` set to `false`)
- Longer paths have priority over shorter

## Route restrictions

Implementing the route restriction is as simple as adding a structural directive on a `route` component

```html
<router>
  <route path="/admin" *ngIf="user.isAuthenticated$ | async">
    <app-admin *routeComponent></app-admin>
  </route>
  <route path="/admin" *ngIf="!(user.isAuthenticated$ | async)">
    <app-login *routeComponent></app-login>
  </route>
</router>
```

The restriction doesn't stop the navigation. It simply removes the route from the configuration so the next eligible route will pick it up.

## Navigating with Links

Use the `linkTo` directive with a _full path_ to register links handled by the router.

```html
<a linkTo="/">Home</a>
<a linkTo="/about">About</a>
<a linkTo="/blog">Blog</a>
```

## Adding classes to active links

To add classes to links that match the current URL path, use the `linkActive` directive.

```html
<a linkTo="/" linkActive="active">Home</a>
<a linkTo="/about" linkActive="active">About</a>
<a linkTo="/blog" linkActive="active" [activeOptions]="{ exact: false }"
  >Blog</a
>
```

## Using the Router service

To navigate from a component class, or get global route information, such as the current URL, or hash fragment, inject the `Router` service.

```ts
import { Component } from '@angular/core';
import { Router } from 'angular-routing';

@Component({...})
export class MyComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.url$.subscribe();
    this.router.hash$.subscribe();
  }

  goHome() {
    this.router.go('/');
  }
}
```

## Using Route Params

To get the route params, inject the `RouteParams` observable. Provide a type for the shape of the route params object.

```ts
import { Component } from '@angular/core';
import { RouteParams } from 'angular-routing';

@Component({...})
export class MyComponent {
  constructor(
    private routeParams$: RouteParams<{ postId: string }>
  ) {}

  ngOnInit() {
    this.routeParams$.subscribe(console.log);
  }
}
```

## Using Query Params

To get the route params, inject the `QueryParams` observable. Provide a type for the shape of the query params object.

```ts
import { Component } from '@angular/core';
import { QueryParams } from 'angular-routing';

@Component({...})
export class MyComponent {
  constructor(
    private queryParams$: QueryParams<{ debug: boolean }>
  ) {}

  ngOnInit() {
    this.queryParams$.subscribe(console.log);
  }
}
```

## Lazy Loading Modules

To lazy load a module, use the `load` binding on the `route` component.

```ts
import { Component } from '@angular/core';

@Component({
  template: `
    <router>
      <route path="/lazy" [exact]="false" [load]="modules.lazy"> </route>
    </router>
  `,
})
export class MyComponent {
  modules = {
    lazy: () => import('./lazy/lazy.module').then((m) => m.LazyModule),
  };
}
```

Register a component to register the child routes.

```ts
import { NgModule, Component } from '@angular/core';
import { ModuleWithRoute } from 'angular-routing';

@Component({
  template: `
    <router>
      <route path="/">
        <app-lazy *routeComponent></app-lazy>
      </route>
      <route path="/" [exact]="false" redirectTo="/404"> </route>
    </router>
  `,
})
export class LazyRouteComponent {}
```

Implement the `ModuleWithRoute` interface for the route component to render after the module is loaded.

```ts
@NgModule({
  declarations: [LazyRouteComponent, LazyComponent],
})
export class LazyModule implements ModuleWithRoute {
  routeComponent = LazyRouteComponent;
}
```

## Lazy Loading Components

To lazy load a component, use the `load` binding on the `route` component.

```ts
import { Component } from '@angular/core';

@Component({
  template: `
    <router>
      <route path="/lazy" [load]="components.lazy"> </route>
    </router>
  `,
})
export class MyComponent {
  components = {
    lazy: () => import('./lazy/lazy.component').then((m) => m.LazyComponent),
  };
}
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://missing-manual.com/"><img src="https://avatars2.githubusercontent.com/u/881612?v=4" width="100px;" alt=""/><br /><sub><b>Miroslav Jonaš</b></sub></a><br /><a href="https://github.com/brandonroberts/angular-routing/commits?author=meeroslav" title="Code">💻</a> <a href="https://github.com/brandonroberts/angular-routing/commits?author=meeroslav" title="Documentation">📖</a></td>
    <td align="center"><a href="https://www.santoshyadav.dev"><img src="https://avatars3.githubusercontent.com/u/11923975?v=4" width="100px;" alt=""/><br /><sub><b>Santosh Yadav</b></sub></a><br /><a href="https://github.com/brandonroberts/angular-routing/commits?author=santoshyadavdev" title="Code">💻</a> <a href="https://github.com/brandonroberts/angular-routing/commits?author=santoshyadavdev" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
