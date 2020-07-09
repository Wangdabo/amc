import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { WorkshopgovRoutingModule} from './workshopgov-routing.module';
import { ComponentModule} from '../../component/component.module';
import { SharedModule } from '../../shared/shared.module';
import {  TransactionModule} from '../../transaction-manage/transaction.module';
import { Tx990300Component } from './trans/tx990300/tx990300.component';
import { Tx990601Component } from './trans/tx990601/tx990601.component';
import { Tx990600Component } from './trans/tx990600/tx990600.component';
import {LayoutModule} from "../../layout/layout.module";
import { Tx990606Component } from './trans/tx990606/tx990606.component';
import { Tx990607Component } from './trans/tx990607/tx990607.component';
import { Tx990608Component } from './trans/tx990608/tx990608.component';
import { Tx990609Component } from './trans/tx990609/tx990609.component';
import { Tx990610Component } from './trans/tx990610/tx990610.component';

import { Tx990611Component } from './trans/tx990611/tx990611.component';
import { Tx990612Component } from './trans/tx990612/tx990612.component';
import { Tx990613Component } from './trans/tx990613/tx990613.component';
import { Tx990614Component } from './trans/tx990614/tx990614.component';
import { Tx990615Component } from './trans/tx990615/tx990615.component';
import { Tx990616Component } from './trans/tx990616/tx990616.component';
import { Tx900617Component } from './trans/tx900617/tx900617.component';
import { Tx990618Component } from './trans/tx990618/tx990618.component';
import { Tx990617Component } from './trans/tx990617/tx990617.component';
import { Tx990619Component } from './trans/tx990619/tx990619.component';


@NgModule({
  imports: [
    CommonModule,
    WorkshopgovRoutingModule,
    ComponentModule,
    SharedModule,
    TransactionModule,
    LayoutModule
  ],
  declarations: [IndexComponent, DashbordComponent, Tx990600Component, Tx990300Component, Tx990601Component, Tx990606Component,
     Tx990607Component, Tx990608Component,
     Tx990609Component,
     Tx990610Component,
      Tx990611Component, Tx990612Component, Tx990613Component, Tx990614Component, Tx990615Component, 
      Tx990616Component, Tx900617Component, Tx990618Component, Tx990617Component, Tx990619Component],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkshopgovModule { }
