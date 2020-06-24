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
import { RouterModule } from '@reactiveangular/router';
import { AuthGuard } from '@example-app/auth/services';


@Component({
  selector: 'app-books',
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
    </router>
  `
})
export class BooksComponent {
  loggedIn$ = this.authGuard.canActivate();

  constructor(private authGuard: AuthGuard) {}
}

export const COMPONENTS = [
  BookAuthorsComponent,
  BookDetailComponent,
  BookPreviewComponent,
  BookPreviewListComponent,
  BookSearchComponent,
  BooksComponent
];

export const CONTAINERS = [
  FindBookPageComponent,
  ViewBookPageComponent,
  SelectedBookPageComponent,
  CollectionPageComponent,
  BooksComponent
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    PipesModule,
  ],
  declarations: [COMPONENTS, CONTAINERS],
  entryComponents: [BooksComponent]
})
export class BooksModule {}
