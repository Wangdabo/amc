import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import {SubTransactionInput} from '../../../interface/sub-transaction-input';

import {TransCommonApiHelper} from '../../trans-common-api-helper';
import {TransactionContextHelper} from '../../../context/transaction.context.helper';

const transCode = 'tx990341_3';
const transName = '员工信息维护';
const tableName = 'btf_trans_inmenu';
const exFuncCode = ['transInfoQuery'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'trans_code', label: '交易代码'
  }, {
    key: 'trans_name', label: '交易名称'
  }, {
    key: 'trans_seqno', label: '位置顺序'
  }, {
    key: 'trans_alais', label: '显示别名'
  }],
  queryHeader:  [
    { label: '交易代码', value: 'trans_code',  type: 'input',  filedType:  'string' },
    { label: '显示别名', value: 'trans_alais', type: 'input',  filedType:  'string'}
  ],
  tableName: tableName,
  joinOps: [
    {
      // 关联表
      joinTable: 'btf_trans_info',
      // 需要查询的关联表中的字段明
      queryJoinFields: [{fieldName: 'trans_name', alias: 'trans_name'}],
      // 关联主表字段
      mainField: 'trans_code',
      // 关联表字段
      joinField: 'trans_code'
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
  selector: 'app-tx990341_3',
  templateUrl: './tx990341_3.component.html',
  styleUrls: ['./tx990341.component.css']
})
export class Tx990341_3Component extends CrudTransaction implements SubTransactionInput {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  menucodete:any;
  notificationService1:any;
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
    this.notificationService1 = notification;
  }

  onEnterAfter(): void {
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService});
  }
  listDataCallback(data: any): void {
  }
  inputParams(params: any): void {
    this.queryModel.staticParams = {menu_code: params};
    this.menucodete = params;
  }

  // 公共赋值提交
  commonSetform() {
    setTimeout(_ => {
      this.baseForm.disabled('menu_code',true);
      this.baseForm.disabled('trans_name',true);
      this.baseForm.setValue('menu_code',this.menucodete);
    });
  }
  onUpdateActionBefore(model: any): void {
     this.commonSetform()
  }

  onAddActionBefore(): void {
    this.commonSetform()
  }
  monitorChangeEvent($event) {
    console.log($event);
    if ($event!=null && $event.length == 8) {
    	TransCommonApiHelper.conditionQuery(this, 'transInfoQuery', {tablename: 'btf_trans_info', page: '1', pagesize: '10',params:[{
            'logic': 'AND',
            'queryList': [{
              'logic': 'AND',
              'operator': 'EQ',
              'params': ['trans_code',$event]}]
          }]});
    }
  }

  onCrudTransactionContextChange(tcFuncCode: string, transactionContext: TransactionContext, transCode) {
    if (tcFuncCode === 'transInfoQuery') {
      const sresultData = TransactionContextHelper.getServiceResult(transactionContext, tcFuncCode, transCode);
      console.log(sresultData);
      this.queryactionafter(sresultData);
      return;
    }

  }

  queryactionafter(resdata){
  	if (resdata.returncode === '000000'){
  		if(resdata.resultdata.bdy.data.length != 0){

  			this.baseForm.setValue('trans_name',resdata.resultdata.bdy.data[0].trans_name);
  		}else{
  			this.notificationService1.create('error', '失败', '此交易代码不存在');
  		}

  	}else{
  		this.notificationService1.create('error', '失败', resdata.returnmessage);
  	}

  }


}

