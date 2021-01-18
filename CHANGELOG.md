<a name="0.4.0"></a>

# [0.4.0](https://github.com/brandonroberts/angular-routing/compare/0.3.1...0.4.0) (2021-01-18)

### Bug Fixes

- add missing takeUntil operator ([#73](https://github.com/brandonroberts/angular-routing/issues/73)) ([102f1b3](https://github.com/brandonroberts/angular-routing/commit/102f1b3))
- apply nullable checks for async inputs ([#74](https://github.com/brandonroberts/angular-routing/issues/74)) ([4b9dc22](https://github.com/brandonroberts/angular-routing/commit/4b9dc22))
- do not strip single slash in linkTo directive ([#83](https://github.com/brandonroberts/angular-routing/issues/83)) ([33bb938](https://github.com/brandonroberts/angular-routing/commit/33bb938)), closes [#71](https://github.com/brandonroberts/angular-routing/issues/71)
- do not use index for current route comparison ([a9bc5be](https://github.com/brandonroberts/angular-routing/commit/a9bc5be))
- set hash from parsed URL correctly ([405cb51](https://github.com/brandonroberts/angular-routing/commit/405cb51))

### Features

- add back/forward api for router service([#78](https://github.com/brandonroberts/angular-routing/issues/78)) ([fdcb917](https://github.com/brandonroberts/angular-routing/commit/fdcb917)), closes [#19](https://github.com/brandonroberts/angular-routing/issues/19)

<a name="0.3.1"></a>

## [0.3.1](https://github.com/brandonroberts/angular-routing/compare/0.3.0...0.3.1) (2020-12-28)

### Features

- **router:** replace path-to-regexp with internal matcher ([#64](https://github.com/brandonroberts/angular-routing/issues/64)) ([d34dfc0](https://github.com/brandonroberts/angular-routing/commit/d34dfc0)), closes [#58](https://github.com/brandonroberts/angular-routing/issues/58)
- add more demo applications ([#68](https://github.com/brandonroberts/angular-routing/issues/68)) ([9ed17ec](https://github.com/brandonroberts/angular-routing/commit/9ed17ec))

<a name="0.3.0"></a>

# [0.3.0](https://github.com/brandonroberts/angular-routing/compare/0.2.2...0.3.0) (2020-12-02)

### Features

- **router:** add ability to unregister a route ([#60](https://github.com/brandonroberts/angular-routing/issues/60)) ([e8cff9b](https://github.com/brandonroberts/angular-routing/commit/e8cff9b)), closes [#49](https://github.com/brandonroberts/angular-routing/issues/49)
- add deep comparison of params ([#52](https://github.com/brandonroberts/angular-routing/issues/52)) ([1075b43](https://github.com/brandonroberts/angular-routing/commit/1075b43))
- sort routes based on path and matching priority ([00564b4](https://github.com/brandonroberts/angular-routing/commit/00564b4)), closes [#48](https://github.com/brandonroberts/angular-routing/issues/48)
- use deep compare for checking params ([#57](https://github.com/brandonroberts/angular-routing/issues/57)) ([65ea7b6](https://github.com/brandonroberts/angular-routing/commit/65ea7b6))

<a name="0.2.2"></a>

## [0.2.2](https://github.com/brandonroberts/angular-routing/compare/0.2.1...0.2.2) (2020-08-04)

### Features

- provide matched path in route component ([#38](https://github.com/brandonroberts/angular-routing/issues/38)) ([da7daed](https://github.com/brandonroberts/angular-routing/commit/da7daed))

<a name="0.2.1"></a>

## [0.2.1](https://github.com/brandonroberts/angular-routing/compare/0.2.0...0.2.1) (2020-07-23)

### Bug Fixes

- pass `exact` option when parsing route params ([#36](https://github.com/brandonroberts/angular-routing/issues/36)) ([156f01e](https://github.com/brandonroberts/angular-routing/commit/156f01e))
- pass base to URL only when value is provided ([#32](https://github.com/brandonroberts/angular-routing/issues/32)) ([3810e3b](https://github.com/brandonroberts/angular-routing/commit/3810e3b))

### Features

- allow Angular v10 as peer dependency ([#31](https://github.com/brandonroberts/angular-routing/issues/31)) ([b0e67ba](https://github.com/brandonroberts/angular-routing/commit/b0e67ba))
- allow paths without leading slash ([#34](https://github.com/brandonroberts/angular-routing/issues/34)) ([03ad384](https://github.com/brandonroberts/angular-routing/commit/03ad384))
- ng-add schematics implementation ([#16](https://github.com/brandonroberts/angular-routing/issues/16)) ([54e728b](https://github.com/brandonroberts/angular-routing/commit/54e728b)), closes [#9](https://github.com/brandonroberts/angular-routing/issues/9)

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
