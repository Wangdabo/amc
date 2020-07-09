import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import {DatePipe} from "@angular/common";
const transCode = 'tx990523';
const transName = '外设管理';
const tableName = 'btf_workstationdcs';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'device_code', label: '外设型号'
  }, {
    key: 'device_name', label: '外设名称'
  }, {
    key: 'device_type', label: '外设类型', dictId: 'SYS_DEVICE_TYPE'
  }, {
    key: 'is_availability', label: '有效标志', dictId: 'SYS_VALID_FLAG'
  }],
  tableName: tableName
};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options
})
@Component({
  selector: 'app-tx990523',
  templateUrl: './tx990523.component.html',
  styleUrls: ['./tx990523.component.css']
})
export class Tx990523Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  constructor(public settingService: SettingService, private notification: NzNotificationService, private datePipe: DatePipe,private modelService: NzModalService) {
    super(transCode);
  }
  onEnterAfter(): void {
    this.queryModel.rowActions = [];
    this.queryModel.topActions = [];
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService});
    console.log(this.queryModel)
  }
  listDataCallback(data: any): void {

  }

  onAddOrUpdateBefore(submitData:any):any{

  }

  rowActiveHandler($event) {

  }
}

