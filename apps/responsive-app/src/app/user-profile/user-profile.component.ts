import { Component, OnInit } from '@angular/core';
import { RouteParams } from 'angular-routing';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ra-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  id$: Observable<string>;

  constructor(private routeParams$: RouteParams<{ id: string }>) {}

  ngOnInit(): void {
    this.id$ = this.routeParams$.pipe(map((param) => param.id));
  }
}
