import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import {DatePipe} from "@angular/common";

const transCode = 'tx990381';
const transName = '渠道信息维护';
const tableName = 'btf_branch_channel';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'channel_code', label: '渠道代码'
  }, {
    key: 'channel_name', label: '渠道名称'
  }, {
    key: 'switch_flag', label: '渠道开关', dictId: 'SYS_SWITCH_FLAG'
  }],
  queryHeader:  [
    { label: '渠道代码', value: 'channel_code',  type: 'input',  filedType:  'string' },
    { label: '渠道名称', value: 'channel_name',  type: 'input',  filedType:  'string'},
    { label: '渠道开关', value: 'switch_flag', type: 'select',  filedType:  'string', dictId: 'SYS_SWITCH_FLAG'}
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
  selector: 'app-tx990381',
  templateUrl: './tx990381.component.html',
  styleUrls: ['./tx990381.component.css']
})
export class Tx990381Component extends CrudTransaction {
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

