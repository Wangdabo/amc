import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { IfearmService } from '../../../../service/ifearm.service';
import { BaseTransaction } from '../../base-transaction';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
const transCode = 'tx990515';
const transName = '配置中心';
const tableName = '';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990515',
  templateUrl: './tx990515.component.html',
  styleUrls: ['./tx990515.component.css']
})
export class Tx990515Component extends BaseTransaction {
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>;
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }> = new EventEmitter();
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{
    type: string
    transCode: string
    params: any
  }> = new EventEmitter();
  orbitUrl: SafeResourceUrl;
  constructor(public ifearm: IfearmService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer
  ) {
    super(transCode);
 

  }

  onEnterAfter(): void {

    this.orbitUrl = this.ifearm.registryCenter;
    
    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);

  }
  listDataCallback(data: any): void {
  }

  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    /*let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    ).resultdata;*/
  }

}
