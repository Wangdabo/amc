import {ChangeDetectionStrategy, ChangeDetectorRef,Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import {FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import { Tx990231_1Component } from './tx990231_1.component';
import { BaseTransaction } from '../../base-transaction';
import {OutputAction} from '../../../interface/custom-action/output.action';

import {ResultData, ServiceResult} from 'tms-platform';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import {Tx990231_2Component} from '../tx990231/tx990231_2.component';

const transCode = 'tx990231edit';
const transName = '交易明细';
const tableName = 'btf_transset';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {


};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options,
  subTransCodes: ['tx990231_2','tx990231_1']
})
@Component({
  selector: 'app-tx990231edit',
  templateUrl: './tx990231edit.component.html',
  styleUrls: ['./tx990231.component.css']
})
export class Tx990231editComponent extends BaseTransaction implements OutputAction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @ViewChild('tx990231_1', {static: true})
  tx990231_1: Tx990231_1Component;
  @ViewChild('tx990231_2', {static: true})
  tx990231_2: Tx990231_2Component;

  @Input('params') params: any;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
    sindex: number;
    tabs: { id: string; text: string; }[];

  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService, private cd: ChangeDetectorRef) {
    super(transCode);
  }

  onEnterAfter(): void {

        super.initBase(this.transactionContextChangeOb, this.submitEvent);

        this.initTab();
        this.sindex = 0;


  }
  tabSelect(tabId: string) {

    if (tabId === 'transseta') {
      setTimeout(_=> {
    	this.tx990231_1.inputParams(this.params);
    	this.tx990231_1.onEnterAfter();});
    }
    if (tabId === 'menua') {

    	this.tx990231_2.inputParams(this.params);
    	this.tx990231_2.onEnterAfter();
    }

  }
  customOutput(data: ServiceResult, tcFuncCode: string): void {
    const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);
    if (parse.name === Tx990231_2Component.name) {
      this.tx990231_2.customOutput(data, parse.funcCode);
    }
    if (parse.name === Tx990231_1Component.name) {
      this.tx990231_1.customOutput(data, parse.funcCode);
    }

  }
  onTransactionContextChange(tcFuncCode: string, transactionContext: TransactionContext) {
    try{

      const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);
      if (parse.name === Tx990231_2Component.name) {
        this.tx990231_2.onTransactionContextChange(parse.funcCode, transactionContext, 'tx990231_2');
        return;
      }
      if (parse.name === Tx990231_1Component.name) {
        this.tx990231_1.onTransactionContextChange(parse.funcCode, transactionContext, 'tx990231_1');
        return;
      }

    } finally {
      this.cd.markForCheck();
    }
  }
  initTab() {
    this.tabs = [
      {id: 'transseta', text: '功能组角色'},
      {id: 'menua', text: '所属菜单'}
    ];
  }

  submitTx990231_2EventHandler(event: {svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}) {
    super.submit(event.svcCode, TransactionContextHelper.formatFuncCode('tx990231_2', event.tcFuncCode), event.funcCode, event.bdy);
  }

  submitTx990231_1EventHandler(event: {svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}) {
    super.submit(event.svcCode, TransactionContextHelper.formatFuncCode('tx990231_1', event.tcFuncCode), event.funcCode, event.bdy);
  }
}




