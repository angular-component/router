import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteParams } from 'angular-routing';

import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';

import {
  BookAuthorsComponent,
  BookDetailComponent,
} from '@example-app/books/components';
import { SelectedBookPageComponent } from '@example-app/books/containers';
import { ViewBookPageComponent } from '@example-app/books/containers';
import { ViewBookPageActions } from '@example-app/books/actions';
import * as fromBooks from '@example-app/books/reducers';
import { AddCommasPipe } from '@example-app/shared/pipes/add-commas.pipe';
import { MaterialModule } from '@example-app/material';

describe('View Book Page', () => {
  let fixture: ComponentFixture<ViewBookPageComponent>;
  let store: MockStore;
  let routeParams: RouteParams;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      providers: [
        {
          provide: RouteParams,
          useValue: new BehaviorSubject({}),
        },
        provideMockStore(),
      ],
      declarations: [
        ViewBookPageComponent,
        SelectedBookPageComponent,
        BookDetailComponent,
        BookAuthorsComponent,
        AddCommasPipe,
      ],
    });

    fixture = TestBed.createComponent(ViewBookPageComponent);
    store = TestBed.inject(MockStore);
    routeParams = TestBed.inject(RouteParams);

    jest.spyOn(store, 'dispatch');
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a book.Select action on init', () => {
    const action = ViewBookPageActions.selectBook({ id: '2' });

    (routeParams as BehaviorSubject<any>).next({ id: '2' });

    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });
});
