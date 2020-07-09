import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import {DatePipe} from "@angular/common";

const transCode = 'tx990141';
const transName = '外设套装管理';
const tableName = 'btf_dcssuit';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'suit_code', label: '外设套装代码',isclick:true
  }, {
    key: 'suit_name', label: '套装名称'
  }, {
    key: 'is_availability', label: '有效标志', dictId: 'SYS_VALID_FLAG'
  }],
  queryHeader:  [
    { label: '外设套装代码', value: 'suit_code',  type: 'input',  filedType:  'string' },
    { label: '套装名称', value: 'suit_name',  type: 'input',  filedType:  'string'},
    { label: '有效标志', value: 'is_availability',  type: 'select',  filedType:  'string', dictId: 'SYS_VALID_FLAG'}
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
  selector: 'app-tx990141',
  templateUrl: './tx990141.component.html',
  styleUrls: ['./tx990141.component.css']
})
export class Tx990141Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{type: string, transCode: string, params: any}> = new EventEmitter(); // 引入跳转路由方法
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  constructor(public settingService: SettingService, private notification: NzNotificationService, private datePipe: DatePipe,private modelService: NzModalService) {
    super(transCode);
  }
  tochildinfo:any;
  onEnterAfter(): void {
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService, sonRouteEvent: this.sonRouteEvent});
  }
  listDataCallback(data: any): void {

  }
  // 跳转路由方法
  skipTx990145() {
    super.skipSonRoute('tx990145', {suit_code: this.tochildinfo});
  }
  rowActiveHandler($event){
  	this.tochildinfo = $event.suit_code;
  	this.skipTx990145();
  }
  onAddOrUpdateBefore(submitData:any):any{

  }


}

