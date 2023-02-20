import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentRouterModule } from '@angular-component/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';

import { AppComponent } from './app.component';
import { RestrictedComponent } from './restricted/restricted.component';
import { HomeComponent } from './home/home.component';
import { UnknownComponent } from './unknown/unknown.component';

@NgModule({
  declarations: [
    AppComponent,
    RestrictedComponent,
    HomeComponent,
    UnknownComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    // material
    MatToolbarModule,
    MatButtonModule,
    MatChipsModule,
    // router
    ComponentRouterModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
