import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";
const transCode = 'tx990382';
const transName = '终端管理';
const tableName = 'btf_workstation';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'workstation_code', label: '工作站代码'
  }, {
    key: 'version_no', label: '版本号'
  }, {
    key: 'workstation_name', label: '工作站名称'
  },{
    key: 'org_code', label: '机构代码'
  },{
    key: 'channel_code', label: '渠道代码'
  },{
    key: 'workstation_kind', label: '工作站类别', dictId: 'SYS_WORKSTATION_KIND'
  },{
    key: 'workstation_status', label: '工作站状态', dictId: 'SYS_WORKSTATION_STATUS'
  },{
    key: 'workstation_switch', label: '工作站开关', dictId: 'SYS_WORKSTATION_SWITCH'
  },{
    key: 'suit_code', label: '套装代码', isclick:true
  }],
  queryHeader:  [
    { label: '工作站代码', value: 'workstation_code',  type: 'input',  filedType:  'string' },
    { label: '版本号', value: 'version_no',  type: 'input',  filedType:  'string'},
    { label: '工作站名称', value: 'workstation_name',  type: 'input',  filedType:  'string'},
    { label: '机构代码', value: 'org_code',  type: 'input',  filedType:  'string'},
    { label: '渠道代码', value: 'channel_code',  type: 'input',  filedType:  'string'},
    { label: '工作站类别', value: 'workstation_kind', type: 'select',  filedType:  'string', dictId: 'SYS_WORKSTATION_KIND'},
    { label: '工作站状态', value: 'workstation_status', type: 'select',  filedType:  'string', dictId: 'SYS_WORKSTATION_STATUS'},
    { label: '工作站开关', value: 'workstation_switch', type: 'select',  filedType:  'string', dictId: 'SYS_WORKSTATION_SWITCH'},
    { label: '套装代码', value: 'suit_code',  type: 'input',  filedType:  'string'}
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
  selector: 'app-tx990382',
  templateUrl: './tx990382.component.html',
  styleUrls: ['./tx990382.component.css']
})
export class Tx990382Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  // 安装状态
  optionArray1 = [
    { name: '穿墙式', value: '0' },
    { name: '大堂式', value: '1' }
  ];

  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  constructor(public settingService: SettingService,   private router: Router,private notification: NzNotificationService, private datePipe: DatePipe,private modelService: NzModalService) {
    super(transCode);
  }
  tochildinfo:any;
  onEnterAfter(): void {
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService});
  }
  listDataCallback(data: any): void {

  }
  onAddOrUpdateBefore(submitData:any):any{

  }

  rowActiveHandler($event){
    this.router.navigateByUrl('gov/dashbord/transaction/tx990141');
  }
}

