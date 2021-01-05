import { Component, OnInit } from '@angular/core';
import { RouteParams } from '@angular-component/router';
import { FamilyMember, SimpsonsService } from '../service/simpsons.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'rr-relatives',
  templateUrl: './relatives.component.html',
  styleUrls: ['./relatives.component.css'],
})
export class RelativesComponent implements OnInit {
  relatives$: Observable<FamilyMember[]>;

  constructor(
    private readonly routeParams$: RouteParams<{ id: string }>,
    private readonly service: SimpsonsService
  ) {}

  ngOnInit(): void {
    this.relatives$ = this.routeParams$.pipe(
      map(({ id }) => this.service.getRelatives(id))
    );
  }

  trackBy(index: number, item: FamilyMember): string {
    return item.id;
  }
}
