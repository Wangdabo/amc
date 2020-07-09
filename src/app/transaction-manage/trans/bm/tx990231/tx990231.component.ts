import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';

const transCode = 'tx990231';
const transName = '交易信息维护';
const tableName = 'btf_trans_info';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'trans_code', label: '交易代码', isclick: true
  }, {
    key: 'trans_name', label: '交易名称'
  }, {
    key: 'valid_flag', label: '有效状态', dictId: 'SYS_VALID_FLAG'
  }, {
    key: 'biz_type', label: '应用类别', dictId: 'SYS_BIZ_TYPE'
  }, {
    key: 'trans_desc', label: '交易描述'
  }],
  queryHeader: [
    { label: '交易代码', value: 'trans_code', type: 'input', filedType: 'string' },
    { label: '交易名称', value: 'trans_name', type: 'input', filedType: 'string' },
    { label: '有效状态', value: 'valid_flag', type: 'select', filedType: 'string', dictId: 'SYS_VALID_FLAG' },
    { label: '应用类别', value: 'biz_type', type: 'select', filedType: 'string', dictId: 'SYS_BIZ_TYPE' },
    { label: '交易描述', value: 'trans_desc', type: 'input', filedType: 'string' }
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
  selector: 'app-tx990231',
  templateUrl: './tx990231.component.html',
  styleUrls: ['./tx990231.component.css']
})
export class Tx990231Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{ tcFuncCode: string, transactionContext: TransactionContext }>;
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{ type: string, transCode: string, params: any }> = new EventEmitter();
  @Output('submitEvent') submitEvent: EventEmitter<{ svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }> = new EventEmitter();
  tochildinfo: any;
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
  }
  onEnterAfter(): void {
    // this.queryModel.rowActions.push({ key: 'transfac', label: '交易工厂' })
    this.queryModel.rowActions[2] = { key: 'transfacs', label: '交易工厂' };

    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService, sonRouteEvent: this.sonRouteEvent
    });
  }
  listDataCallback(data: any): void {
  }

  onAddActionBefore(): void {
    console.log('iuhhgf');
    this.baseForm.setValue('version_flag', 'Finally');
  }

  skipedit() {
    super.skipSonRoute('tx990231edit', { trans_code: this.tochildinfo });
  }
  rowActiveHandler($event) {
    this.tochildinfo = $event.trans_code;
    this.skipedit();
  }

  rowActionsHandler($event) {
    if ($event.key === 'transfacs') {
      super.skipSonRoute('tx990236', { trans_code: $event.item.trans_code });
    } else {
      super.rowActionsHandler($event);
    }
  }
}


