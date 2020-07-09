import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import {DatePipe} from "@angular/common";

const transCode = 'tx990171';
const transName = '交易流水查询';
const tableName = 'btf_trans_jnl';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'trans_serial_no', label: '交易流水号'
  }, {
    key: 'trans_code', label: '交易代码'
  }, {
    key: 'trans_date', label: '交易日期'
  }, {
    key: 'teller_code', label: '交易柜员'
  }, {
    key: 'org_code', label: '网点代码'
  }, {
    key: 'service_serial_no', label: '服务流水号'
  }],
  queryHeader:  [
    { label: '交易代码', value: 'trans_serial_no',  type: 'input',  filedType:  'string' },
    { label: '交易代码', value: 'trans_code',  type: 'input',  filedType:  'string'},
    { label: '交易日期', value: 'trans_date', type: 'select',  filedType:  'string'},
    { label: '交易柜员', value: 'teller_code', type: 'select',  filedType:  'string'},
    { label: '网点代码', value: 'org_code', type: 'select',  filedType:  'string'},
    { label: '服务流水号', value: 'service_serial_no', type: 'select',  filedType:  'string'}
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
  selector: 'app-tx990171',
  templateUrl: './tx990171.component.html',
  styleUrls: ['./tx990171.component.css']
})
export class Tx990171Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  constructor(public settingService: SettingService, private notification: NzNotificationService, private datePipe: DatePipe,private modelService: NzModalService) {
    super(transCode);
  }
  onEnterAfter(): void {
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService});
  }
  listDataCallback(data: any): void {

  }

  onAddOrUpdateBefore(submitData:any):any{

  }


}

