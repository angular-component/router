import { CommonModule } from '@angular/common';
import { NgModule, Component } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import {
  BookAuthorsComponent,
  BookDetailComponent,
  BookPreviewComponent,
  BookPreviewListComponent,
  BookSearchComponent,
} from '@example-app/books/components';
import {
  CollectionPageComponent,
  FindBookPageComponent,
  SelectedBookPageComponent,
  ViewBookPageComponent,
} from '@example-app/books/containers';

import { MaterialModule } from '@example-app/material';
import { PipesModule } from '@example-app/shared/pipes';
import {
  ComponentRouterModule,
  ModuleWithRoute,
} from '@angular-component/router';
import { AuthGuard } from '@example-app/auth/services';
import { BookEffects, CollectionEffects } from '@example-app/books/effects';

import * as fromBooks from '@example-app/books/reducers';

@Component({
  selector: 'bc-books',
  template: `
    <router *ngIf="loggedIn$ | async">
      <route path="/find">
        <bc-find-book-page *routeComponent></bc-find-book-page>
      </route>
      <route path="/:id">
        <bc-view-book-page *routeComponent></bc-view-book-page>
      </route>
      <route path="/">
        <bc-collection-page *routeComponent></bc-collection-page>
      </route>
      <route path="/" [exact]="false" redirectTo="/404"> </route>
    </router>
  `,
})
export class BooksComponent {
  loggedIn$ = this.authGuard.isLoggedIn();

  constructor(private authGuard: AuthGuard) {}
}

export const COMPONENTS = [
  BookAuthorsComponent,
  BookDetailComponent,
  BookPreviewComponent,
  BookPreviewListComponent,
  BookSearchComponent,
  BooksComponent,
];

export const CONTAINERS = [
  FindBookPageComponent,
  ViewBookPageComponent,
  SelectedBookPageComponent,
  CollectionPageComponent,
  BooksComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ComponentRouterModule,
    PipesModule,
    /**
     * StoreModule.forFeature is used for composing state
     * from feature modules. These modules can be loaded
     * eagerly or lazily and will be dynamically added to
     * the existing state.
     */
    StoreModule.forFeature(fromBooks.booksFeatureKey, fromBooks.reducers),
    /**
     * Effects.forFeature is used to register effects
     * from feature modules. Effects can be loaded
     * eagerly or lazily and will be started immediately.
     *
     * All Effects will only be instantiated once regardless of
     * whether they are registered once or multiple times.
     */
    EffectsModule.forFeature([BookEffects, CollectionEffects]),
  ],
  declarations: [COMPONENTS, CONTAINERS],
})
export class BooksModule implements ModuleWithRoute {
  routeComponent = BooksComponent;
}
