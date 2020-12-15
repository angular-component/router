import { Component, OnInit } from '@angular/core';
import { FamilyMember, SimpsonsService } from '../service/simpsons.service';

@Component({
  selector: 'rr-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  members: FamilyMember[];

  constructor(private readonly service: SimpsonsService) {}

  ngOnInit(): void {
    this.members = this.service.getAll();
  }

  trackBy(index: number, item: FamilyMember): string {
    return item.id;
  }
}
