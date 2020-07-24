# Angular routing
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
