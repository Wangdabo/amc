import {ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';

import {SettingService} from '../../../../service/setting.service';
import { FormComponent} from "tms-platform-component";
const transCode = 'tx990231_2';
const transName = '交易-菜单';
const tableName = 'btf_trans_inmenu';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'menu_code', label: '菜单代码'
  }, {
    key: 'menu_name', label: '菜单名称'
  }, {
    key: 'system_flag', label: '所属渠道', dictId: 'SYS_SYSTEM_FLAG'
  }, {
    key: 'show_name', label: '显示别名'
  }, {
    key: 'menu_seqno', label: '所属菜单位置'
  }],
  queryHeader:  [
    { label: '角色代码', value: 'menu_code',  type: 'input',  filedType:  'string' },
  ],
  tableName: tableName,
  joinOps: [
    {
      // 关联表
      joinTable: 'btf_menu',
      // 需要查询的关联表中的字段明
      queryJoinFields: [{fieldName: 'menu_name', alias: 'menu_name'}],
      // 关联主表字段
      mainField: 'menu_code',
      // 关联表字段
      joinField: 'menu_code'
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
  selector: 'app-tx990231_2',
  templateUrl: './tx990231_2.component.html',
  styleUrls: ['./tx990231.component.css'],
})
export class Tx990231_2Component extends CrudTransaction {
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
    this.queryModel.staticParams = params;
    // this.parentorgte = params;
    console.log('input--->');
    console.log(this.queryModel.staticParams);
  }

}
