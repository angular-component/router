import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentRouterModule } from '@angular-component/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';

import { AppComponent } from './app.component';
import { MediaDirective } from './use-media/use-media.directive';
import { SelectUserComponent } from './select-user/select-user.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    MediaDirective,
    SelectUserComponent,
    UserProfileComponent,
    UserListComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    // material
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatGridListModule,
    // router
    ComponentRouterModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
