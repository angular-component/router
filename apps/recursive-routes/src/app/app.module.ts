import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SimpsonsService } from './service/simpsons.service';
import { NgModule } from '@angular/core';
import { ComponentRouterModule } from '@angular-component/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

import { AppComponent } from './app.component';
import { MemberComponent } from './member/member.component';
import { ListComponent } from './list/list.component';
import { RelativesComponent } from './relatives/relatives.component';

@NgModule({
  declarations: [
    AppComponent,
    MemberComponent,
    ListComponent,
    RelativesComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    // material
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    // router
    ComponentRouterModule.forRoot(),
  ],
  providers: [SimpsonsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
