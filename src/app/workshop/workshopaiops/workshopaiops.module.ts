import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { WorkshopaiopsRoutingModule} from './workshopaiops-routing.module';
import { ComponentModule} from '../../component/component.module';
import { SharedModule } from '../../shared/shared.module';
import {  TransactionModule} from '../../transaction-manage/transaction.module';
import {LayoutModule} from "../../layout/layout.module";



@NgModule({
  imports: [
    CommonModule,
    WorkshopaiopsRoutingModule,
    ComponentModule,
    SharedModule,
    TransactionModule,
    LayoutModule
  ],
  declarations: [IndexComponent, DashbordComponent]
})
export class WorkshopaiopsModule { }
