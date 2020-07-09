import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

const transCode = 'tx990301';
const transName = '角色信息维护';
const tableName = 'btf_role_info';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'role_code', label: '角色代码', isclick:true
  }, {
    key: 'role_name', label: '角色名称'
  }, {
    key: 'valid_flag', label: '有效状态', dictId: 'SYS_VALID_FLAG'
  },  {
    key: 'auth_level', label: '授权级别',width:'15%'
  }, {
    key: 'admin_level', label: '允许管理员级别', dictId: 'SYS_ADMIN_LEVEL'
  }, {
    key: 'allow_biz_range', label: '允许应用类别', multipldictId: 'SYS_ALLOW_BIZ_RANGE'
  }],
  queryHeader:  [
    { label: '角色代码', value: 'role_code',  type: 'input',  filedType:  'string' },
    { label: '角色名称', value: 'role_name',  type: 'input',  filedType:  'string'},
    { label: '有效状态', value: 'valid_flag', type: 'select',  filedType:  'string', dictId: 'SYS_VALID_FLAG'},
    { label: '授权级别', value: 'auth_level',  type: 'input',  filedType:  'string'},
    { label: '允许管理员级别', value: 'admin_level',  type: 'select',  filedType:  'string', dictId: 'SYS_ADMIN_LEVEL'}
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
  selector: 'app-tx990301',
  templateUrl: './tx990301.component.html',
  styleUrls: ['./tx990301.component.css']
})
export class Tx990301Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{type: string, transCode: string, params: any}> = new EventEmitter();
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
  tochildinfo:any;
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
  }
  onEnterAfter(): void {
    super.initCrud({transactionContextChangeOb: this.transactionContextChangeOb, submitEvent: this.submitEvent,
      baseForm: this.baseForm, notification: this.notification, modelService: this.modelService, sonRouteEvent: this.sonRouteEvent});
  }
  onUpdateActionBefore(model: any): void {
      this.baseForm.disabled('role_code',true);
    //   this.baseForm.disabled('role_name',true);
    //   this.baseForm.disabled('valid_flag',true);
    //   this.baseForm.disabled('auth_level',true);
  }
  onAddActionBefore(): void {
      this.baseForm.disabled('role_code',false);
    //   this.baseForm.disabled('role_name',false);
    //   this.baseForm.disabled('valid_flag',false);
    //   this.baseForm.disabled('auth_level',false);
  }

  onAddOrUpdateBefore(submitData:any):any{
    let allowbiz = submitData.allow_biz_range;
    let allowbizstr = "";
    if(allowbiz.length == 1){
    	allowbizstr = allowbiz[0];
    }else{
    	for(let i=0;i<allowbiz.length;i++){
	    	allowbizstr += allowbiz[i]
	    	if(i<allowbiz.length-1){
	    		allowbizstr += ","
	    	}
    	}
    }

    submitData.allow_biz_range = allowbizstr;

  }
  listDataCallback(data: any): void {

  	for(let i=0;i<data.length;i++){
  	    if(data[i].allow_biz_range != "" && data[i].allow_biz_range != null&&typeof(data[i].allow_biz_range)== 'string'){
  	    	console.log(data[i].allow_biz_range);
  	    	data[i].allow_biz_range = data[i].allow_biz_range.split(",");
  	    }


  	}
  }
  skipedit(){
    super.skipSonRoute('tx990301edit', {role_code:this.tochildinfo});
  }
  rowActiveHandler($event){
  	this.tochildinfo = $event.role_code;
  	this.skipedit();
  }

  clickActiveHandler($event) {
    console.log($event)
  }

}

