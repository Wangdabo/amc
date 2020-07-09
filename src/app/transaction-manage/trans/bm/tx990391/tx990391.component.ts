import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';

const transCode = 'tx990391';
// const transName = '业务字典维护';
// const tableName = 'ctf_dictionary';
// const exFuncCode = [];
// const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
// const options = {

// };
@Transaction({
  transCode: 'tx990391',
  transName: '业务字典维护',
  funcCode: CrudTransaction.BASE_FUNC.concat([]),
  options: {
    header: [{
      key: 'dict_key', label: '字典Key', isclick: true
    }, {
      key: 'dict_type', label: '字典类型', dictId: 'SYS_DICT_TYPE'
    }, {
      key: 'dict_name', label: '字典名称'
    }],
    queryHeader: [
      { label: '字典Key', value: 'dict_key', type: 'input', filedType: 'string' },
      { label: '字典类型', value: 'dict_type', type: 'select', filedType: 'string', dictId: 'SYS_DICT_TYPE' },
      { label: '字典名称', value: 'dict_name', type: 'input', filedType: 'string' }
    ],
    tableName: 'ctf_dictionary'
  }
})
@Component({
  selector: 'app-tx990391',
  templateUrl: './tx990391.component.html',
  styleUrls: ['./tx990391.component.css']
})
export class Tx990391Component extends CrudTransaction {
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
    console.log('初始化');

    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService, sonRouteEvent: this.sonRouteEvent
    });
  }


  listDataCallback(data: any): void {
  }
  skipTx990395() {
    super.skipSonRoute('tx990395', { dict_key: this.tochildinfo });
  }
  rowActiveHandler($event) {
    this.tochildinfo = $event.dict_key;
    this.skipTx990395();
  }
  onUpdateActionBefore(model: any): void {
    this.baseForm.disabled('dict_key', true);
  }
  onAddActionBefore(): void {
    this.baseForm.disabled('dict_key', false);
  }


}

