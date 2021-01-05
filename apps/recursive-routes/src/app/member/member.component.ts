import { Component, OnInit } from '@angular/core';
import { RouteParams, RoutePath } from '@angular-component/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FamilyMember, SimpsonsService } from '../service/simpsons.service';

@Component({
  selector: 'rr-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
})
export class MemberComponent implements OnInit {
  member$: Observable<FamilyMember>;

  constructor(
    private readonly routeParams$: RouteParams<{ id: string }>,
    private readonly service: SimpsonsService,
    public readonly path$: RoutePath
  ) {}

  ngOnInit(): void {
    this.member$ = this.routeParams$.pipe(
      map(({ id }) => this.service.getMember(id))
    );
  }
}
