import { Component, ChangeDetectionStrategy } from '@angular/core';
import { getRouter } from '@angular-component/router';

@Component({
  selector: 'bc-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>404: Not Found</mat-card-title>
      <mat-card-content>
        <p>Hey! It looks like this page doesn't exist yet.</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="goHome()">
          Take Me Home
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      :host {
        text-align: center;
      }
    `,
  ],
})
export class NotFoundPageComponent {
  private router = getRouter();

  goHome() {
    this.router.go('/');
  }
}
