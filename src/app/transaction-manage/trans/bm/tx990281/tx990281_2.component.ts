import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

const transCode = 'tx990281_2';
const transName = '功能组-角色';
const tableName = 'btf_role_transset';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'role_code', label: '角色代码'
  }, {
    key: 'role_name', label: '角色名称'
  }],
  queryHeader:  [
    { label: '角色代码', value: 'role_code',  type: 'input',  filedType:  'string' }
  ],
  tableName: tableName,
  joinOps: [
    {
      // 关联表
      joinTable: 'btf_role_info',
      // 需要查询的关联表中的字段明
      queryJoinFields: [{fieldName: 'role_name', alias: 'role_name'}],
      // 关联主表字段
      mainField: 'role_code',
      // 关联表字段
      joinField: 'role_code'
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
  selector: 'app-tx990281_2',
  templateUrl: './tx990281_2.component.html',
  styleUrls: ['./tx990281.component.css'],
})
export class Tx990281_2Component extends CrudTransaction {
  @ViewChild('baseForm', {static: false})
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
    this.queryModel.staticParams = params;
    // this.parentorgte = params;
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
