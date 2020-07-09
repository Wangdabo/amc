import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

const transCode = 'tx990301_2';
const transName = '角色-用户';
const tableName = 'btf_user_org_role';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'user_code', label: '用户代码'
  }, {
    key: 'user_name', label: '用户名称'
  }],
  queryHeader:  [
    { label: '用户代码', value: 'user_code',  type: 'input',  filedType:  'string' }
  ],
  tableName: tableName,
  joinOps: [
    {
      // 关联表
      joinTable: 'btf_user_info',
      // 需要查询的关联表中的字段明
      queryJoinFields: [{fieldName: 'user_name', alias: 'user_name'}],
      // 关联主表字段
      mainField: 'user_code',
      // 关联表字段
      joinField: 'user_code'
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
  selector: 'app-tx990301_2',
  templateUrl: './tx990301_2.component.html',
  styleUrls: ['./tx990301.component.css'],
})
export class Tx990301_2Component extends CrudTransaction {
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
    console.log(params)
    this.queryModel.staticParams = params;
    // this.parentorgte = params;
    console.log('input--->');
    console.log(this.queryModel.staticParams);
  }

  // 公共赋值提交
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
