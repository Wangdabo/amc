import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../../context/transaction.context';
import {Observable} from 'rxjs';
import {BaseTransaction} from '../../../base-transaction';
import {SettingService} from '../../../../../service/setting.service';
import {SubTransactionInput} from '../../../../interface/sub-transaction-input';
import { FormComponent} from "tms-platform-component";
const transCode = 'bill-detail';
const transName = '票据详情';
const funcCode = [];

@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
})
@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.css']
})
export class BillDetailComponent extends BaseTransaction implements SubTransactionInput {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  detailModel = {};
  historyModel = {
    header: [{
      key: 'TxId', label: 'TxID'
    }, {
      key: 'TransType', label: '操作业务'
    }, {
      key: 'Description', label: '操作描述'
    }, {
      key: 'Description', label: '当前持票人'
    }],
    data: [{}]
  };
  constructor(public settingService: SettingService) {
    super(transCode);
  }
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    this.baseForm.disabledAll();
  }
  onTransactionContextChange(tcFuncCode: string, transactionContext: TransactionContext, tranCode?: string) {
  }
  inputParams(params: any): void {
    this.queryDetail(params.BillInfoID);
  }
  private queryDetail(BillInfoID: string) {
  }

}
