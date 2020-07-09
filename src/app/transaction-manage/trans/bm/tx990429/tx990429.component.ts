import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

const transCode = 'tx990429';
const transName = '区块链节点与通道';
const tableName = 'fabric_peer_channel';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'peer_id', label: '节点',dictId: 'SYS_PEER_ID'
  }, {
    key: 'channel_id', label: '通道',dictId: 'SYS_CHANNEL_ID'
  }, {
    key: 'type', label: '节点类型',dictId: 'SYS_TYPE'
  }],
  queryHeader:  [

    { label: '节点', value: 'peer_id',  type: 'select',  filedType:  'string',dictId: 'SYS_PEER_ID'},
    { label: '通道', value: 'channel_id', type: 'select',  filedType:  'string',dictId: 'SYS_CHANNERL_ID'},
 { label: '节点类型', value: 'type',  type: 'select',  filedType:  'string',dictId: 'SYS_TYPE' }
  ],
  tableName: tableName,

};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options
})
@Component({
  selector: 'app-tx990429',
  templateUrl: './tx990429.component.html',
  styleUrls: ['./tx990429.component.css'],
})
export class Tx990429Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
  }
  onEnterAfter(): void {
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService});
  }
  listDataCallback(data: any): void {
  }
}
