import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import {DatePipe} from "@angular/common";

const transCode = 'tx990145';
const transName = '错误码参数维护';
const tableName = 'btf_dcsinsuit';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'device_code', label: '外设型号'
  }, {
    key: 'device_name', label: '外设名称'
  }, {
    key: 'link_type', label: '连接方式', dictId: 'SYS_LINK_TYPE'
  }, {
    key: 'conn_port', label: '连接端口'
  }, {
    key: 'ext_port', label: '扩展端口'
  }, {
    key: 'w_timeout', label: '写超时'
  }, {
    key: 'r_timeout', label: '读超时'
  }],
  queryHeader:  [
    { label: '外设型号', value: 'device_code',  type: 'input',  filedType:  'string' },
    { label: '外设名称', value: 'device_name',  type: 'select',  filedType:  'string', alias: 'devicet'},
    { label: '连接方式', value: 'link_type',  type: 'select',  filedType:  'string', dictId: 'SYS_LINK_TYPE'},
    { label: '连接端口', value: 'conn_port',  type: 'input',  filedType:  'string'},
    { label: '扩展端口', value: 'ext_port',  type: 'input',  filedType:  'string'},
    { label: '写超时', value: 'w_timeout',  type: 'input',  filedType:  'string'},
    { label: '读超时', value: 'r_timeout',  type: 'input',  filedType:  'string'}
  ],
  tableName: tableName,
  joinOps: [
    {
      // 关联表
      joinTable: 'btf_workstationdcs',
      // 表别名
      tableAlias: 'devicet',
      // 需要查询的关联表中的字段明
      queryJoinFields: [{fieldName: 'device_name', alias: 'device_name'}],
      // 关联主表字段
      mainField: 'device_code',
      // 关联表字段
      joinField: 'device_code'
    }
  ]
};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options
})
@Component({
  selector: 'app-tx990145',
  templateUrl: './tx990145.component.html',
  styleUrls: ['./tx990145.component.css']
})
export class Tx990145Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Input('params') params: any;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  constructor(public settingService: SettingService, private notification: NzNotificationService, private datePipe: DatePipe,private modelService: NzModalService) {
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
      this.baseForm.disabled('suit_code',true);
      this.baseForm.setValue('suit_code',this.queryModel.staticParams.suit_code);
    });
  }

  onUpdateActionBefore(model: any): void {
        this.commonSetform()
  }

  onAddActionBefore(): void {
    this.commonSetform()
  }

}

