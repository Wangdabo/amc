import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import {WorkshopopsRoutingModule} from './workshopops-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {TransactionModule} from '../../transaction-manage/transaction.module';
import {Tx991001Component} from './trans/tx991001/tx991001.component';
import {Tx991002Component} from './trans/tx991002/tx991002.component';
import {PublishComponent} from './trans/tx991002/publish/publish.component';
import {ComponentModule} from '../../component/component.module';
import {LayoutModule} from "../../layout/layout.module";


@NgModule({
  declarations: [IndexComponent, DashbordComponent, Tx991001Component, Tx991002Component, PublishComponent],
  imports: [
    CommonModule,
    SharedModule,
    WorkshopopsRoutingModule,
    TransactionModule,
    ComponentModule,
    LayoutModule
  ]
})
export class WorkshopopsModule { }
