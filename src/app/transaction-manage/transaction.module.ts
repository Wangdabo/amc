import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TransactionComponent } from './component/transaction.component';
import { DynamicTransactionComponent } from './component/dynamic-transaction/dynamic-transaction.component';
import { ComponentModule } from '../component/component.module';
import { TransModule } from './trans/trans.module';
@NgModule({
  imports: [SharedModule, ComponentModule, TransModule],
  declarations: [
    TransactionComponent,
    DynamicTransactionComponent,
  ],
  exports: [
    TransactionComponent,
  ],
  schemas: [],
})
export class TransactionModule { }
