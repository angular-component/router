import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { getRouteParams } from '@angular-component/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromBooks from '@example-app/books/reducers';
import { ViewBookPageActions } from '@example-app/books/actions';

/**
 * Note: Container components are also reusable. Whether or not
 * a component is a presentation component or a container
 * component is an implementation detail.
 *
 * The View Book Page's responsibility is to map router params
 * to a 'Select' book action. Actually showing the selected
 * book remains a responsibility of the
 * SelectedBookPageComponent
 */
@Component({
  selector: 'bc-view-book-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <bc-selected-book-page></bc-selected-book-page> `,
})
export class ViewBookPageComponent implements OnDestroy {
  actionsSubscription: Subscription;
  private routeParams$ = getRouteParams<{ id: string }>();

  constructor(store: Store<fromBooks.State>) {
    this.actionsSubscription = this.routeParams$
      .pipe(map((params) => ViewBookPageActions.selectBook({ id: params.id })))
      .subscribe((action) => store.dispatch(action));
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
