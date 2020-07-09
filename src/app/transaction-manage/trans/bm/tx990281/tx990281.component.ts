import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

const transCode = 'tx990281';
const transName = '功能组信息维护';
const tableName = 'btf_transset';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'trans_set_code', label: '功能组代码',isclick:true
  }, {
    key: 'trans_set_name', label: '功能组名称'
  }, {
    key: 'all_trans_flag', label: '全交易标识', dictId: 'SYS_ALL_TRANS_FLAG'
  },  {
    key: 'trans_set_desc', label: '功能组描述'
  }],
  queryHeader:  [
    { label: '功能组代码', value: 'trans_set_code',  type: 'input',  filedType:  'string' },
    { label: '功能组名称', value: 'trans_set_name',  type: 'input',  filedType:  'string'},
    { label: '全交易标识', value: 'all_trans_flag', type: 'select',  filedType:  'string', dictId: 'SYS_ALL_TRANS_FLAG'}
  ],
  tableName: tableName

};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options
})
@Component({
  selector: 'app-tx990281',
  templateUrl: './tx990281.component.html',
  styleUrls: ['./tx990281.component.css']
})
export class Tx990281Component extends CrudTransaction {
  @ViewChild('baseForm', {static: false})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{type: string, transCode: string, params: any}> = new EventEmitter();
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  tochildinfo:any;
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
  }
  onEnterAfter(): void {
  	//this.queryModel.rowActions = [{key: 2, label: "删除"}];
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService, sonRouteEvent: this.sonRouteEvent});
  }
  listDataCallback(data: any): void {
  }

  onUpdateActionBefore(model: any): void {
      this.baseForm.disabled('trans_set_code',true);
  }
  onAddActionBefore(): void {
      this.baseForm.disabled('trans_set_code',false);
  }

  skipedit(){
    super.skipSonRoute('tx990281edit', {trans_set_code:this.tochildinfo});
  }
  rowActiveHandler($event){
  	this.tochildinfo = $event.trans_set_code;
  	this.skipedit();
  }
}




