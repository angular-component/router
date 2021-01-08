import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRouterModule } from '@angular-component/router';

import { MaterialModule } from '@example-app/material';
import {
  LayoutComponent,
  NavItemComponent,
  SidenavComponent,
  ToolbarComponent,
} from '@example-app/core/components';
import {
  AppComponent,
  NotFoundPageComponent,
} from '@example-app/core/containers';
import { AuthModule } from '@example-app/auth';

export const COMPONENTS = [
  AppComponent,
  NotFoundPageComponent,
  LayoutComponent,
  NavItemComponent,
  SidenavComponent,
  ToolbarComponent,
];

@NgModule({
  imports: [CommonModule, ComponentRouterModule, MaterialModule, AuthModule],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CoreModule {}
