import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

const transCode = 'tx990211_1';
const transName = '机构信息维护';
const tableName = 'btf_org_info';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'org_code', label: '机构代码'
  }, {
    key: 'org_name', label: '机构名称'
  }, {
    key: 'par_org_code', label: '上级机构代码'
  }, {
    key: 'par_org_name', label: '上级机构名称'
  }, {
    key: 'trans_flag', label: '是否交易机构', dictId: 'SYS_TRANS_FLAG'
  }, {
    key: 'org_level', label: '机构层级'
  }],
  queryHeader:  [
    { label: '机构代码', value: 'org_code',  type: 'input',  filedType:  'string' },
    { label: '机构名称', value: 'org_name',  type: 'input',  filedType:  'string'},
    { label: '上级机构', value: 'par_org_code', type: 'select',  filedType:  'string', dictId: 'BDICT002'},
    { label: '是否交易机构', value: 'trans_flag',  type: 'input',  filedType:  'number'},
    { label: '机构层级', value: 'org_level',  type: 'input',  filedType:  'number'}
  ],
  tableName: tableName,
  joinOps: [
    {
      // 关联表
      joinTable: 'btf_org_info',
      // 需要查询的关联表中的字段明
      queryJoinFields: [{fieldName: 'org_name', alias: 'par_org_name'}],
      // 关联主表字段
      mainField: 'par_org_code',
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
  selector: 'app-tx990211_1',
  templateUrl: './tx990211_1.component.html',
  styleUrls: ['./tx990211.component.css'],
})
export class Tx990211_1Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
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
  }
}
