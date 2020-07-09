import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import { ReturnStatement } from '@angular/compiler';

const transCode = 'tx990281_1';
const transName = '功能组-交易维护';
const tableName = 'btf_transset_trans_auth';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'trans_code', label: '交易代码'
  }, {
    key: 'trans_name', label: '交易名称'
  }, {
    key: 'biz_type', label: '应用类别', dictId: 'SYS_BIZ_TYPE'
  }],
  queryHeader:  [
    { label: '交易代码', value: 'trans_code',  type: 'input',  filedType:  'string' },
    { label: '交易名称', value: 'trans_name',  type: 'input',  filedType:  'string',alias:'trasinfo'},
    { label: '应用类别', value: 'biz_type', type: 'select',  filedType:  'string', dictId: 'SYS_BIZ_TYPE',alias:'trasinfo'}
  ],
  tableName: tableName,
   joinOps: [
    {
      // 关联表
      joinTable: 'btf_trans_info',
      tableAlias:'trasinfo',
      // 需要查询的关联表中的字段明
      queryJoinFields: [{fieldName: 'trans_name', alias: 'trans_name'},{fieldName: 'biz_type', alias: 'biz_type'}],
      // 关联主表字段
      mainField: 'trans_code',
      // 关联表字段
      joinField: 'trans_code'
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
  selector: 'app-tx990281_1',
  templateUrl: './tx990281_1.component.html',
  styleUrls: ['./tx990281.component.css'],
})
export class Tx990281_1Component extends CrudTransaction {
  @ViewChild('baseForm', {static: false})
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


  // 公共赋值提交
  commonSetform() {
    setTimeout(_ => {
      this.baseForm.disabled('trans_set_code',true);

      this.baseForm.setValue('trans_set_code',this.queryModel.staticParams.trans_set_code);
    });
  }

  onUpdateActionBefore(model: any): void {
      this.commonSetform()
  }
  onAddActionBefore(): void {
    this.commonSetform()
  }






}
