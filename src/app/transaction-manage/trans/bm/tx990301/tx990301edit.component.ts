import {ChangeDetectionStrategy, ChangeDetectorRef,Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import { Tx990301_1Component } from './tx990301_1.component';
import { BaseTransaction } from '../../base-transaction';
import {OutputAction} from '../../../interface/custom-action/output.action';

import {ResultData, ServiceResult} from 'tms-platform';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import {Tx990301_2Component} from '../tx990301/tx990301_2.component';

const transCode = 'tx990301edit';
const transName = '角色关联明细维护';
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
  subTransCodes: ['tx990301_2','tx990301_1']
})
@Component({
  selector: 'app-tx990301edit',
  templateUrl: './tx990301edit.component.html',
  styleUrls: ['./tx990301.component.css']
})
export class Tx990301editComponent extends BaseTransaction implements OutputAction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @ViewChild('tx990301_1', {static: false})
  tx990301_1: Tx990301_1Component;
  @ViewChild('tx990301_2', {static: false})
  tx990301_2: Tx990301_2Component;

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

    if (tabId === 'transa') {
      setTimeout(_=> {
    	this.tx990301_1.inputParams(this.params);
    	this.tx990301_1.onEnterAfter();});
    }
    if (tabId === 'rolea') {

    	this.tx990301_2.inputParams(this.params);
    	this.tx990301_2.onEnterAfter();
    }

  }
  customOutput(data: ServiceResult, tcFuncCode: string): void {
    const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);
    if (parse.name === Tx990301_2Component.name) {
      this.tx990301_2.customOutput(data, parse.funcCode);
    }
    if (parse.name === Tx990301_1Component.name) {
      this.tx990301_1.customOutput(data, parse.funcCode);
    }

  }
  onTransactionContextChange(tcFuncCode: string, transactionContext: TransactionContext) {
    try{

      const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);
      if (parse.name === Tx990301_2Component.name) {
        this.tx990301_2.onTransactionContextChange(parse.funcCode, transactionContext, 'tx990301_2');
        return;
      }
      if (parse.name === Tx990301_1Component.name) {
        this.tx990301_1.onTransactionContextChange(parse.funcCode, transactionContext, 'tx990301_1');
        return;
      }

    } finally {
      this.cd.markForCheck();
    }
  }
  initTab() {
    this.tabs = [
      {id: 'transa', text: '包括功能组'},
      {id: 'rolea', text: '用户'}
    ];
  }

  submitTx990301_2EventHandler(event: {svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}) {
    super.submit(event.svcCode, TransactionContextHelper.formatFuncCode('tx990301_2', event.tcFuncCode), event.funcCode, event.bdy);
  }

  submitTx990301_1EventHandler(event: {svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}) {
    super.submit(event.svcCode, TransactionContextHelper.formatFuncCode('tx990301_1', event.tcFuncCode), event.funcCode, event.bdy);
  }
}




