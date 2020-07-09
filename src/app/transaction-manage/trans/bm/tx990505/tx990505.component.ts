import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {Observable} from 'rxjs';
import {FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import {BaseTransaction} from '../../base-transaction';
import {BillDetailComponent} from './bill-detail/bill-detail.component';
import {TransactionContextHelper} from '../../../context/transaction.context.helper';

const transCode = 'tx990505';
const transName = '机构信息维护';
const funcCode = [];
const options = {
  header: [{
    key: 'BillInfoID', label: '票据号'
  }, {
    key: 'State', label: '票据状态'
  }, {
    key: 'Description', label: '所属关系'
  }]
};
enum ACTIONS {
  PUBLISH, DETAIL, PUSH
}
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  subTransCodes: ['bill-detail']
})
@Component({
  selector: 'app-tx990505',
  templateUrl: './tx990505.component.html',
  styleUrls: ['./tx990505.component.css'],
})
export class Tx990505Component extends BaseTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @ViewChild('billDetail', {static: true})
  billDetail: BillDetailComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();

  rowActions = [{ key: ACTIONS.DETAIL, label: '详情' }, { key: ACTIONS.PUSH, label: '发起背书' }];
  topActions = [{ key: ACTIONS.PUBLISH, label: '发布票据', icon: 'plus', isHide: false }];
  insertModel = {
    isVisible: false,
    isOkLoading: false,
    data: {}
  };
  detailModel = {
    isVisible: false,
    isOkLoading: false,
    detailId: ''
  };
  pushModel = {
    isVisible: false,
    isOkLoading: false,
    data: {}
  };
  queryModel = {
    header: options.header,
    data: [{}],
    isLoading: false
  };
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
  }
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent);
  }
  onTransactionContextChange(tcFuncCode: string, transactionContext: TransactionContext, transCode?: string) {
  }
  topActionsHandler($event: { key: string | number }): void {
    switch ($event.key) {
      case ACTIONS.PUBLISH:
        this.add();
        break;
    }
  }
  private add() {
    this.insertModel.data = {};
    this.insertModel.isVisible = true;
  }
  rowActionsHandler($event: { key: string | number, item: any }): void {
    switch ($event.key) {
      case ACTIONS.DETAIL:
        this.detail($event.item.BillInfoID);
        break;
      case ACTIONS.PUSH:
        this.push();
        break;
    }
  }
  private detail(id: string) {
    this.detailModel.isVisible = true;
    this.billDetail.inputParams({BillInfoID: id});
    this.billDetail.onEnterAfter();
  }
  private push() {
    this.pushModel.data = {};
    this.pushModel.isVisible = true;
  }
  handleCancel() {
    this.insertModel.isVisible = false;
  }
  handleOk()  {
  }
  handleDetailCancel() {
    this.detailModel.isVisible = false;
  }
  handlePushCancel() {
    this.pushModel.isVisible = false;
  }
  handlePushOk()  {
  }
  submitBillDetailEventHandler(event: {svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}) {
    super.submit(event.svcCode, TransactionContextHelper.formatFuncCode('bill-detail', event.tcFuncCode), event.funcCode, event.bdy);
  }
}
