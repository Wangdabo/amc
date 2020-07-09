import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

const transCode = 'tx990211_2';
const transName = '机构信息维护';
const tableName = 'btf_org_info';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'org_name', label: '机构名称'
  }, {
    key: 'org_code', label: '机构代码'
  }, {
    key: 'org_type', label: '机构类型', dictId: 'SYS_ORG_TYPE'
  }, {
    key: 'org_status', label: '机构状态', dictId: 'SYS_ORG_STATUS'
  }, {
    key: 'org_work_status', label: '工作状态', dictId: 'SYS_ORG_WORK_STATUS'
  }],
  queryHeader:  [
    { label: '机构名称', value: 'org_name',  type: 'input',  filedType:  'string' },
    { label: '机构代码', value: 'org_code',  type: 'input',  filedType:  'string'},
    { label: '机构类型', value: 'org_type', type: 'select',  filedType:  'string', dictId: 'SYS_ORG_TYPE'},
    { label: '机构状态', value: 'org_status',  type: 'select',  filedType:  'string', dictId: 'SYS_ORG_STATUS'},
    { label: '工作状态', value: 'org_work_status',  type: 'select',  filedType:  'string', dictId: 'SYS_ORG_WORK_STATUS'}
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
  selector: 'app-tx990211_2',
  templateUrl: './tx990211_2.component.html',
  styleUrls: ['./tx990211.component.css'],
})
export class Tx990211_2Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  parentorgte:any;
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
    this.queryModel.staticParams = {par_org_code: params};
    this.parentorgte = params;
    console.log('input--->');
    console.log(this.queryModel.staticParams);
  }
  onUpdateActionBefore(model: any): void {
      setTimeout(_ => {
      	this.baseForm.disabled('org_code',true);
      	this.baseForm.disabled('par_org_code',false);
	  	this.baseForm.setValue('par_org_code',this.parentorgte);
	  	this.cd.markForCheck();
	  });
  }
  onAddActionBefore(): void {
      setTimeout(_ => {
      	this.baseForm.disabled('org_code',false);
      	this.baseForm.disabled('par_org_code',false);
	  	this.baseForm.setValue('par_org_code',this.parentorgte);
        this.cd.markForCheck();
	  });
  }
}
