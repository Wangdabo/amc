import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent} from "tms-platform-component";
import { SettingService } from '../../../../service/setting.service';

const transCode = 'tx990433';
const transName = '区块链节点与智能合约';
const tableName = 'fabric_peer_chaincode';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'peer_id', label: '节点', dictId: 'SYS_PEER_ID'
  }, {
    key: 'chaincode_id', label: '智能合约', dictId: 'SYS_CHAINCODE_ID'
  }, {
    key: 'channel_id', label: '通道', dictId: 'SYS_CHANNEL_ID'
  }, {
    key: 'chaincode_version', label: '智能合约版本'
  }],
  queryHeader: [

    { label: '节点', value: 'peer_id', type: 'select', filedType: 'string', dictId: 'SYS_PEER_ID' },
    { label: '通道', value: 'channel_id', type: 'select', filedType: 'string', dictId: 'SYS_CHANNERL_ID' },
    { label: '智能合约', value: 'chaincode_id', type: 'select', filedType: 'string', dictId: 'SYS_CHAINCODE_ID' }
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
  selector: 'app-tx990433',
  templateUrl: './tx990433.component.html',
  styleUrls: ['./tx990433.component.css'],
})
export class Tx990433Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{ tcFuncCode: string, transactionContext: TransactionContext }>;
  @Output('submitEvent') submitEvent: EventEmitter<{ svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }> = new EventEmitter();
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
  }
  onEnterAfter(): void {
    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService
    });
  }
  listDataCallback(data: any): void {
  }
}
