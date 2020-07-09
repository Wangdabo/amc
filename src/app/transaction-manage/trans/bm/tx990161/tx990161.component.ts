import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';
import {DatePipe} from "@angular/common";

const transCode = 'tx990161';
const transName = '模拟报文管理';
const tableName = 'btf_mock_message';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'server_code', label: '服务代码', width: '10px'
  }, {
    key: 'message_desc', label: '报文描述', width: '100px'
  }, {
    key: 'valid_flag', label: '有效标识', dictId: 'SYS_VALID_FLAG', width: '50px'
  }],
  queryHeader:  [
    { label: '服务代码', value: 'server_code',  type: 'input',  filedType:  'string' },
    { label: '有效标识', value: 'valid_flag', type: 'select',  filedType:  'string', dictId: 'SYS_VALID_FLAG'}
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
  selector: 'app-tx990161',
  templateUrl: './tx990161.component.html',
  styleUrls: ['./tx990161.component.css']
})
export class Tx990161Component extends CrudTransaction {
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


  onAddOrUpdateBefore(submitData:any):any{
    let message_descstr = submitData.message_desc;
    if(message_descstr!=""&&message_descstr!=null){
        // submitData.message_desc = JSON.parse(message_descstr);
    }

    let message_contentstr = submitData.message_content;
    if(message_contentstr!=""&&message_contentstr!=null){
        // submitData.message_content = JSON.parse(message_contentstr);
    }

  }
  listDataCallback(data: any): void {

  	for(let i=0;i<data.length;i++){
  	    if(data[i].message_desc != "" && data[i].message_desc != null&&this.isJson(data[i].message_desc)){
  	    	console.log(data[i].message_desc);
  	    	data[i].message_desc = JSON.stringify(data[i].message_desc);
          }

        if(data[i].message_content != "" && data[i].message_content != null&&this.isJson(data[i].message_content)){
  	    	console.log(data[i].message_content);
  	    	data[i].message_content = JSON.stringify(data[i].message_content);
  	    }


  	}
  }

  isJson(obj){
	var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
	return isjson;
    }



}

