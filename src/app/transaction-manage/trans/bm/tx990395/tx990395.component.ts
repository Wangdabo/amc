import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

const transCode = 'tx990395';
const transName = '业务字典项维护';
const tableName = 'ctf_dictionary_item';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'dict_key', label: '字典Key'
  }, {
    key: 'item_name', label: '选项名'
  }, {
    key: 'send_value', label: '实际值'
  }, {
    key: 'item_value', label: '显示值'
  }, {
    key: 'seqno', label: '排序'
  }],
  queryHeader:  [
    { label: '选项名', value: 'item_name',  type: 'input',  filedType:  'string' },
    { label: '实际值', value: 'send_value',  type: 'input',  filedType:  'string'},
    { label: '显示值', value: 'item_value', type: 'input',  filedType:  'string' }
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
  selector: 'app-tx990395',
  templateUrl: './tx990395.component.html',
  styleUrls: ['./tx990395.component.css']
})
export class Tx990395Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Input('params') params: any;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
  }
  onEnterAfter(): void {
    this.queryModel.staticParams = this.params;
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService});
  }
  listDataCallback(data: any): void {
  }
// 公共赋值提交
  commonSetform() {
    setTimeout(_ => {
      this.baseForm.disabled('dict_key',true);

      this.baseForm.setValue('dict_key',this.queryModel.staticParams.dict_key);
    });
  }

  onUpdateActionBefore(model: any): void {
      this.commonSetform()
  }
  onAddActionBefore(): void {
    this.commonSetform()
  }

}

