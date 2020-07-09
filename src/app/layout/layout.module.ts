import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DefaultComponent } from './shell/default.component';
import { PassportComponent } from './passport/passport.component';
import { HeaderComponent } from './shell/header/header.component';
import { FooterComponent } from './shell/footer/footer.component';
import { ComponentModule} from "../component/component.module";
import {Error404Component} from "./passport/error/error404/error404.component";
import {Error401Component} from "./passport/error/error401/error401.component";
import {Error500Component} from "./passport/error/error500/error500.component";
import { NewHeaderComponent } from './shell/new-header/new-header.component';
import { WorktoggleComponent } from './shell/worktoggle/worktoggle.component';

const COMPONENTS = [
  DefaultComponent,
  PassportComponent,
  HeaderComponent,
  FooterComponent,
  Error404Component,
  Error401Component,
  Error500Component,
  NewHeaderComponent,
  HeaderComponent
];
@NgModule({
  imports: [
    SharedModule,
    ComponentModule
  ],
  declarations: [
    ...COMPONENTS,
    WorktoggleComponent
  ],
  exports: [
    ...COMPONENTS
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule { }
