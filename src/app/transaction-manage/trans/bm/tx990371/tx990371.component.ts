import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

const transCode = 'tx990371';
const transName = '用户信息维护';
const tableName = 'btf_user_info';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'user_code', label: '用户代码'
  }, {
    key: 'user_name', label: '用户名称'
  }, {
    key: 'user_type', label: '用户类型', dictId: 'SYS_USER_TYPE'
  }, {
    key: 'org_code', label: '工作机构代码'
  }, {
    key: 'user_status', label: '用户状态', dictId: 'SYS_USER_STATUS'
  }, {
    key: 'work_status', label: '工作状态', dictId: 'SYS_WORK_STATUS'
  }],
  queryHeader:  [
    { label: '用户代码', value: 'user_code',  type: 'input',  filedType:  'string'},
    { label: '用户名称', value: 'user_name',  type: 'input',  filedType:  'string'},
    { label: '用户类型', value: 'user_type',  type: 'select',  filedType:  'string', dictId: 'SYS_USER_TYPE'},
    { label: '工作机构代码', value: 'org_code',  type: 'input', filedType:  'string'},
    { label: '用户状态', value: 'user_status',  type: 'select',  filedType:  'string', dictId: 'SYS_USER_STATUS'},
    { label: '工作状态', value: 'work_status',  type: 'select',  filedType:  'string', dictId: 'SYS_WORK_STATUS'}
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
  selector: 'app-tx990371',
  templateUrl: './tx990371.component.html',
  styleUrls: ['./tx990371.component.css']
})
export class Tx990371Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
  }
  onEnterAfter(): void {
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService});
  }
  listDataCallback(data: any): void {
  }
  onUpdateActionBefore(model: any): void {
      this.baseForm.disabled('user_code',true);
  }
  onAddActionBefore(): void {
      this.baseForm.disabled('user_code',false);
  }
  rechginterval=/^[0-9]*$/;
  monitorChangeEvent($event) {
    console.log($event);
    if ($event === '23') {
      this.baseForm.disabled('sub_type',false);
      console.log('外协单位');
    }else {
      this.baseForm.disabled('sub_type',true);
      this.baseForm.setValue('sub_type','');
      console.log('非外协单位');
    }


  }
}

