import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import {DatePipe} from "@angular/common";

const transCode = 'tx990151';
const transName = '模拟服务管理';
const tableName = 'btf_mock_server';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'server_code', label: '服务代码'
  }, {
    key: 'server_name', label: '服务名称'
  }, {
    key: 'switch_flag', label: '服务开关', dictId: 'SYS_SWITCH_FLAG'
  }],
  queryHeader:  [
    { label: '服务代码', value: 'server_code',  type: 'input',  filedType:  'string' },
    { label: '服务名称', value: 'server_name',  type: 'input',  filedType:  'string'},
    { label: '服务开关', value: 'switch_flag', type: 'select',  filedType:  'string', dictId: 'SYS_SWITCH_FLAG'}
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
  selector: 'app-tx990151',
  templateUrl: './tx990151.component.html',
  styleUrls: ['./tx990151.component.css']
})
export class Tx990151Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  constructor(public settingService: SettingService, private notification: NzNotificationService, private datePipe: DatePipe,private modelService: NzModalService) {
    super(transCode);
  }
  onEnterAfter(): void {
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService});
  }
  listDataCallback(data: any): void {

  }

  onAddOrUpdateBefore(submitData:any):any{

  }


}

