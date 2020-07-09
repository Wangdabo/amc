import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import { ReturnStatement } from '@angular/compiler';

const transCode = 'tx990231_1';
const transName = '交易-功能组维护';
const tableName = 'btf_transset_trans_auth';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'trans_set_code', label: '功能组'
  },{
    key: 'role_code', label: '角色代码'
  }],
  queryHeader:  [
    { label: '功能组', value: 'trans_set_code',  type: 'input',  filedType:  'string' },
  ],
  tableName: tableName,
   joinOps: [
    {
      // 关联表
      joinTable: 'btf_role_transset',
      // 需要查询的关联表中的字段明
      queryJoinFields: [{fieldName: 'role_code', alias: 'role_code'}],
      // 关联主表字段
      mainField: 'trans_set_code',
      // 关联表字段
      joinField: 'trans_set_code'
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
  selector: 'app-tx990231_1',
  templateUrl: './tx990231_1.component.html',
  styleUrls: ['./tx990231.component.css'],
})
export class Tx990231_1Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  deletelist:any;
  modalopen:any;
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
    this.queryModel.staticParams = params;

    console.log('input--->');
    console.log(this.queryModel.staticParams);
  }
  onBeforeInitModel(){
    console.log(this.TOP_ACTIONS);
    this.TOP_ACTIONS[0].isHide = true;
  }

}
