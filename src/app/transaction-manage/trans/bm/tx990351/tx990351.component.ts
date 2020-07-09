import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

const transCode = 'tx990351';
const transName = '人员信息维护';
const tableName = 'btf_emp_info';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'emp_code', label: '员工代码'
  }, {
    key: 'emp_name', label: '员工名称'
  }, {
    key: 'emp_type', label: '员工类型', dictId: 'SYS_EMP_TYPE'
  },  {
    key: 'card_no', label: '证件号码'
  },{
    key: 'org_code', label: '所属机构'
  },{
    key: 'org_name', label: '机构名称'
  }],
  queryHeader:  [
    { label: '员工代码', value: 'emp_code',  type: 'input',  filedType:  'string' },
    { label: '员工名称', value: 'emp_name',  type: 'input',  filedType:  'string'},
    { label: '员工类型', value: 'emp_type', type: 'select',  filedType:  'string', dictId: 'SYS_EMP_TYPE'},
    { label: '证件号码', value: 'card_no',  type: 'input',  filedType:  'number'},
    { label: '机构代码', value: 'org_code',  type: 'input',  filedType:  'string'}
  ],
  tableName: tableName,
  joinOps: [
    {
      // 关联表
      joinTable: 'btf_org_info',
      // 需要查询的关联表中的字段明
      queryJoinFields: [{fieldName: 'org_name', alias: 'org_name'}],
      // 关联主表字段
      mainField: 'org_code',
      // 关联表字段
      joinField: 'org_code'
    }
  ]
};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options
})
@Component({
  selector: 'app-tx990351',
  templateUrl: './tx990351.component.html',
  styleUrls: ['./tx990351.component.css']
})
export class Tx990351Component extends CrudTransaction {
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
      this.baseForm.disabled('emp_code',true);
  }
  onAddActionBefore(): void {
      this.baseForm.disabled('emp_code',false);
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

