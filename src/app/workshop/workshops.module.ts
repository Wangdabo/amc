import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { WorkshopRoutingModule } from './workshops-routing.module';
import { LoginComponent } from '../layout/passport/login/login.component';

@NgModule({
  imports: [
    SharedModule,
    WorkshopRoutingModule,
  ],
  declarations: [LoginComponent],
})
export class WorkshopsModule { }
