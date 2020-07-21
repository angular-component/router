<a name="0.2.0"></a>

# [0.2.0](https://github.com/brandonroberts/angular-routing/compare/0.1.1...0.2.0) (2020-07-21)

### Bug Fixes

- make route matching more explicit ([#25](https://github.com/brandonroberts/angular-routing/issues/25)) ([3b8716b](https://github.com/brandonroberts/angular-routing/commit/3b8716b))

### Features

- **router:** add support for relative paths ([#14](https://github.com/brandonroberts/angular-routing/issues/14)) ([ceb4d80](https://github.com/brandonroberts/angular-routing/commit/ceb4d80)), closes [#2](https://github.com/brandonroberts/angular-routing/issues/2) [#17](https://github.com/brandonroberts/angular-routing/issues/17)
- add sponsor button to repo ([4c5acd4](https://github.com/brandonroberts/angular-routing/commit/4c5acd4))

### BREAKING CHANGES

- Removes usage of `/**` pattern for parent and wildcard routes

BEFORE:

```html
<route path="/books/**"></route>
```

AFTER:

```html
<route path="/books" [exact]="false"></route>
```

<a name="0.1.1"></a>

## [0.1.1](https://github.com/brandonroberts/angular-routing/compare/c2502f6...0.1.1) (2020-07-02)

### Bug Fixes

- clean up observables, updated docs ([cba6db6](https://github.com/brandonroberts/angular-routing/commit/cba6db6))

### Features

- add Angular Getting Started application ([331e825](https://github.com/brandonroberts/angular-routing/commit/331e825))
- add NgRx example app ([8f024e4](https://github.com/brandonroberts/angular-routing/commit/8f024e4))
- add router lib ([c2502f6](https://github.com/brandonroberts/angular-routing/commit/c2502f6))
- add support for lazy loading NgModules ([0d2aa76](https://github.com/brandonroberts/angular-routing/commit/0d2aa76))
- add tour of heroes app ([588dbe6](https://github.com/brandonroberts/angular-routing/commit/588dbe6))

### BREAKING CHANGES

- The input for lazy loading has change from [loadComponent] to [load] to support
  components and NgModules

BEFORE:

<route path="/path" [loadComponent]=""></route>

AFTER:

<route path="/path" [load]=""></route>
