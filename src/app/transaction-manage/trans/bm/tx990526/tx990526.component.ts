import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { SettingService } from '../../../../service/setting.service';
import { DatePipe } from '@angular/common';
import {FormComponent} from "tms-platform-component";
const transCode = 'tx990526';
const transName = '交易操作行为管理';
const tableName = 'btf_trans_bhv';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'bhv_code', label: '操作行为代码'
  }, {
    key: 'bhv_type', label: '操作行为类型'
  }, {
    key: 'bhv_name', label: '操作行为名称'
  }],
  tableName: tableName
};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options
})
@Component({
  selector: 'app-tx990526',
  templateUrl: './tx990526.component.html',
  styleUrls: ['./tx990526.component.css']
})
export class Tx990526Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }> = new EventEmitter()
  constructor(
    public settingService: SettingService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private modelService: NzModalService
  ) {
    super(transCode)
  }
  onEnterAfter(): void {
    console.log('初始化');

    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb,
      submitEvent: this.submitEvent,
      baseForm: this.baseForm,
      notification: this.notification,
      modelService: this.modelService
    })
  }
  listDataCallback(data: any): void { }

  onAddOrUpdateBefore(submitData: any): any { }

  rowActiveHandler($event) {
      console.log($event);
  }
}

