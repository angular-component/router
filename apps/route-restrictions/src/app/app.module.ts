import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoutingModule } from 'angular-routing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

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
    RoutingModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
