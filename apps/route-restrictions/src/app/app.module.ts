import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentRouterModule } from '@angular-component/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UnknownComponent } from './unknown/unknown.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, UnknownComponent],
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
