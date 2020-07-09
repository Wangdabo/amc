import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import { ReturnStatement } from '@angular/compiler';

const transCode = 'tx990301_1';
const transName = '角色-功能组';
const tableName = 'btf_role_transset';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'trans_set_code', label: '功能组代码'
  }, {
    key: 'trans_set_name', label: '功能组名称'
  }, {
    key: 'all_trans_flag', label: '全交易标识', dictId: 'SYS_ALL_TRANS_FLAG'
  }],
  queryHeader:  [
    { label: '功能组代码', value: 'trans_set_code',  type: 'input',  filedType:  'string' }
  ],
  tableName: tableName,
   joinOps: [
    {
      // 关联表
      joinTable: 'btf_transset',
      // 需要查询的关联表中的字段明
      queryJoinFields: [{fieldName: 'trans_set_name', alias: 'trans_set_name'},{fieldName: 'all_trans_flag', alias: 'all_trans_flag'}],
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
  selector: 'app-tx990301_1',
  templateUrl: './tx990301_1.component.html',
  styleUrls: ['./tx990301.component.css'],
})
export class Tx990301_1Component extends CrudTransaction {
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

  // 公共提交服务
  commonSetform() {
    setTimeout(_ => {
      this.baseForm.disabled('role_code',true);

      this.baseForm.setValue('role_code',this.queryModel.staticParams.role_code);
    });
  }

  onUpdateActionBefore(model: any): void {
      this.commonSetform()
  }

  onAddActionBefore(): void {
    this.commonSetform()
  }






}
