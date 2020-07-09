import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

const transCode = 'tx990341_2';
const transName = '菜单信息维护';
const tableName = 'btf_menu';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'menu_code', label: '菜单代码'
  }, {
    key: 'menu_name', label: '菜单名称'
  }, {
    key: 'valid_flag', label: '有效标志', dictId: 'SYS_VALID_FLAG'
  }, {
    key: 'system_flag', label: '所属渠道', dictId: 'SYS_SYSTEM_FLAG'
  }],
  queryHeader:  [
    { label: '菜单代码', value: 'menu_code',  type: 'input',  filedType:  'string' },
    { label: '菜单名称', value: 'menu_name',  type: 'input',  filedType:  'string'},
    { label: '有效标志', value: 'valid_flag', type: 'select',  filedType:  'string', dictId: 'SYS_VALID_FLAG'},
    { label: '所属渠道', value: 'system_flag',  type: 'select',  filedType:  'string', dictId: 'SYS_SYSTEM_FLAG'},
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
  selector: 'app-tx990341_2',
  templateUrl: './tx990341_2.component.html',
  styleUrls: ['./tx990341.component.css'],
})
export class Tx990341_2Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  appId: string;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
  }

  menucodete:any;
  onEnterAfter(): void {
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService});
  }
  listDataCallback(data: any): void {
  }
  inputParams(params: any, appId: any): void {

    this.queryModel.staticParams = {parent_id: params};
    this.menucodete = params;
    this.appId = appId;
  }

  // 公共赋值提交
  commonSetform() {
    setTimeout(_ => {
      this.baseForm.disabled('menu_code',false);
      this.baseForm.disabled('parent_id',true);
      this.baseForm.disabled('app_id',true); // 默认禁选
      this.baseForm.setValue('parent_id',this.menucodete);
      this.baseForm.setValue('app_id',this.appId);
    });
  }
  onUpdateActionBefore(model: any): void {
      this.commonSetform()
  }
  onAddActionBefore(): void {
    this.commonSetform()
  }
}
