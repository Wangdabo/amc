import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

const transCode = 'tx990211_4';
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
    key: 'user_status', label: '用户状态', dictId: 'SYS_USER_STATUS'
  }],
  queryHeader:  [
    { label: '用户代码', value: 'user_code',  type: 'input',  filedType:  'string'},
    { label: '用户名称', value: 'user_name',  type: 'input',  filedType:  'string'},
    { label: '用户类型', value: 'user_type',  type: 'select',  filedType:  'string', dictId: 'SYS_USER_TYPE'},
    { label: '用户状态', value: 'user_status',  type: 'select',  filedType:  'string', dictId: 'SYS_USER_STATUS'}
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
  selector: 'app-tx990211_4',
  templateUrl: './tx990211_4.component.html',
  styleUrls: ['./tx990211.component.css']
})
export class Tx990211_4Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  orgcodete:any;
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService, private cd: ChangeDetectorRef) {
    super(transCode);
  }
  onEnterAfter(): void {
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService});
  }
  listDataCallback(data: any): void {
  }
  inputParams(params: any): void {
    this.queryModel.staticParams = {org_code: params};
    this.orgcodete = params;
  }
  onUpdateActionBefore(model: any): void {
       setTimeout(_ => {
      	this.baseForm.disabled('user_code',true);
      	this.baseForm.disabled('org_code',true);
	  	this.baseForm.setValue('org_code',this.orgcodete);
         this.cd.markForCheck();
	  });
  }
  onAddActionBefore(): void {
      setTimeout(_ => {
      	this.baseForm.disabled('user_code',false);
      	this.baseForm.disabled('org_code',true);
	  	this.baseForm.setValue('org_code',this.orgcodete);
        this.cd.markForCheck();
	  });
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

