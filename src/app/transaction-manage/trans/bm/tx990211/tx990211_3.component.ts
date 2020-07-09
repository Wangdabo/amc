import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import {SubTransactionInput} from '../../../interface/sub-transaction-input';

const transCode = 'tx990211_3';
const transName = '员工信息维护';
const tableName = 'btf_emp_info';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'emp_code', label: '员工代码'
  }, {
    key: 'emp_name', label: '员工名称'
  }, {
    key: 'emp_status', label: '员工状态', dictId: 'SYS_EMP_STATUS'
  }],
  queryHeader:  [
    { label: '员工代码', value: 'emp_code',  type: 'input',  filedType:  'string' },
    { label: '员工名称', value: 'emp_name',  type: 'input',  filedType:  'string'},
    { label: '员工状态', value: 'emp_status', type: 'select',  filedType:  'string', dictId: 'SYS_EMP_STATUS'}
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
  selector: 'app-tx990211_3',
  templateUrl: './tx990211_3.component.html',
  styleUrls: ['./tx990211.component.css']
})
export class Tx990211_3Component extends CrudTransaction implements SubTransactionInput {
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
      	this.baseForm.disabled('emp_code',true);
      	this.baseForm.disabled('org_code',true);
	  	this.baseForm.setValue('org_code',this.orgcodete);
        this.cd.markForCheck();
	  });

  }
  onAddActionBefore(): void {
      setTimeout(_ => {
      	this.baseForm.disabled('emp_code',false);
      	this.baseForm.disabled('org_code',true);
	  	this.baseForm.setValue('org_code',this.orgcodete);
        this.cd.markForCheck();
	  });

  }
  monitorChangeEvent($event) {
    console.log($event);
    if ($event === '1'||$event === '2'||$event === '3') {
      this.baseForm.updataCreat('card_no', 'idCard'); // 如果是身份证类型，那么验证方式是身份证
      console.log('88888');
    }else {
      this.baseForm.updataCreat('card_no', 'null');
      console.log('77777');
    }
  }

}

