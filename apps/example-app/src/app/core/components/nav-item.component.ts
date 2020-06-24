import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'bc-nav-item',
  template: `
    <a mat-list-item [linkTo]="linkTo" (click)="navigate.emit()">
      <mat-icon mat-list-icon>{{ icon }}</mat-icon>
      <span mat-line><ng-content></ng-content></span>
      <span mat-line class="secondary">{{ hint }}</span>
    </a>
  `,
  styles: [
    `
      .secondary {
        color: rgba(0, 0, 0, 0.54);
      }
    `,
  ],
})
export class NavItemComponent {
  @Input() icon = '';
  @Input() hint = '';
  @Input() linkTo: string | any[] = '/';
  @Output() navigate = new EventEmitter();
}
