# angular-routing

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

To register the Router, add the `RoutingModule.forRoot()` to your AppModule providers.

```ts
import { RoutingModule } from 'angular-routing';


@NgModule({
  imports: [
    // ... other imports
    RoutingModule.forRoot()
  ]
})
export class AppModule {}
```

After your components are registered in the `declarations` array, use the `Router` and `Route` components to register some routes.

```html
<a linkTo="/">Home</a>
<a linkTo="/about">About</a>
<a linkTo="/blog">Blog</a>

<router>
  <route path="/blog">
    <app-blog *routeComponent></app-blog>
  </route>
  <route path="/posts/:postId">
    <app-post *routeComponent></app-post>
  </route>
  <route path="/about">
    <app-about *routeComponent></app-about>
  </route>
  <route path="/" redirectTo="/blog">
  </route>
  <route path="**">
    <app-page-not-found *routeComponent></app-page-not-found>
  </route>
</router>
```
