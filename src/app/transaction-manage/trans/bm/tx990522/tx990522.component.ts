import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';
const transCode = 'tx990522';
const transName = '交易流水';
const tableName = 'btf_trans_jnl';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'trans_code', label: '交易代码', isclick: true
  }, {
    key: 'trans_state', label: '交易状态', dictId: 'SYS_VALID_FLAG'
  }, {
    key: 'trans_date', label: '交易时间'
  }, {
    key: 'transinfo_state', label: '录入状态'
  }],
  queryHeader: [],
  tableName: tableName

};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options
})
@Component({
  selector: 'app-tx990522',
  templateUrl: './tx990522.component.html',
  styleUrls: ['./tx990522.component.css']
})
export class Tx990522Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{ tcFuncCode: string, transactionContext: TransactionContext }>;
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{ type: string, transCode: string, params: any }> = new EventEmitter();
  @Output('submitEvent') submitEvent: EventEmitter<{ svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }> = new EventEmitter();
  tochildinfo: any;
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
  }

  onEnterAfter(item?): void {
    this.queryModel.rowActions = [];
    this.queryModel.topActions = [];
    if(item) {
      this.queryModel.staticParams = {
        workstation_code: item
      } // 根据工作站code去查询--交易管理条件查询
    }
    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService, sonRouteEvent: this.sonRouteEvent
    });
    console.log(this.queryModel.data)
  }
  listDataCallback(data: any): void {
  }

  onAddActionBefore(): void {
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


