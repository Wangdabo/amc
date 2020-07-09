import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';

const transCode = 'tx990237';
const transName = '工厂部件';
const tableName = 'btf_tran_unit';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'tran_config_part', label: '部件代码', isclick: true
  }, {
    key: 'part_name', label: '部件名称'
  }, {
    key: 'part_desc', label: '部件描述'
  }, {
    key: 'is_availability', label: '应用类别', dictId: 'USER_COUNTER_ISAVA'
  }],
  queryHeader: [
    { label: '部件代码', value: 'tran_config_part', type: 'input', filedType: 'string' },
    { label: '部件名称', value: 'part_name', type: 'input', filedType: 'string' },
    { label: '部件描述', value: 'part_desc', type: 'select', filedType: 'string' },
    { label: '应用类别', value: 'is_availability', type: 'select', filedType: 'string', dictId: 'USER_COUNTER_ISAVA' },
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
  selector: 'app-tx990237',
  templateUrl: './tx990237.component.html',
  styleUrls: ['./tx990237.component.css']
})
export class Tx990237Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb')
  transactionContextChangeOb: Observable<{ tcFuncCode: string, transactionContext: TransactionContext }>;
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{ type: string, transCode: string, params: any }> = new EventEmitter();
  @Output('submitEvent')
  submitEvent: EventEmitter<{ svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }> = new EventEmitter();
  tochildinfo: any;
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
  }
  onEnterAfter(): void {
    // this.queryModel.rowActions.push({ key: 'transfac', label: '交易工厂' })
    this.queryModel.rowActions[2] = { key: 'transfacs', label: '元件配置' };

    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService, sonRouteEvent: this.sonRouteEvent
    });
  }
  listDataCallback(data: any): void {
  }

  onAddActionBefore(): void {
    // console.log('iuhhgf');
    // this.baseForm.setValue('version_flag', 'Finally');
  }

  skipedit() {
    super.skipSonRoute('tx990231edit', { trans_code: this.tochildinfo });
  }
  rowActiveHandler($event) {
    this.tochildinfo = $event.trans_code;
    this.skipedit();
  }

  rowActionsHandler($event) {
    console.log($event);
    if ($event.key === 'transfacs') {
      super.skipSonRoute('tx990238', { item: $event.item });
    } else {
      super.rowActionsHandler($event);
    }
  }
}


