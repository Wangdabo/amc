import {ChangeDetectionStrategy, ChangeDetectorRef,Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Transaction} from '../../../decorators/transaction.decorator';
import {TransactionContext} from '../../../context/transaction.context';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {CrudTransaction} from '../../crud-transaction';
import {Observable} from 'rxjs';
import { FormComponent} from "tms-platform-component";
import {SettingService} from '../../../../service/setting.service';

import { BaseTransaction } from '../../base-transaction';
import {OutputAction} from '../../../interface/custom-action/output.action';

import {ResultData, ServiceResult} from 'tms-platform';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { TransCommonApiHelper } from "../../trans-common-api-helper"


const transCode = 'tx990235';
const transName = '交易工厂';
const tableName = 'btf_transset';
const exFuncCode = ["tranunitQuery","tranattrQuery"];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {


};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options,
  subTransCodes: []
})
@Component({
  selector: 'app-tx990235',
  templateUrl: './tx990235.component.html',
  styleUrls: ['./tx990235.component.css']
})
export class Tx990235Component extends BaseTransaction implements OutputAction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @ViewChild('baseTransForm', {static: true})
  baseTransForm: FormComponent;

  @Input('params') params: any;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  @Output('submitEvent') submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}> = new EventEmitter();
    sindex: number;
    tabs: { id: string; text: string; }[];
    isshowTab = false;
    contabs: [any];
    controlArray: any;
    TcontrolArray:any;

  initFormTrans() {
    console.log(this.baseTransForm)
  }
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService, private cd: ChangeDetectorRef) {
    super(transCode);
  }
  changesValue($event) {

  }
  onEnterAfter(): void {
    console.log('fac----->')
   console.log(this.params);
   super.initBase(this.transactionContextChangeOb, this.submitEvent)
   //this.queryunit();





  }
  monitorChangeEvent($event) {
    console.log($event);
   let checklist = $event;
   let tablist = [];
   this.contabs = ["tran_config_part"];
   for(let i=0;i<checklist.length;i++){
       if(checklist[i].checked){
            tablist.push({
              id: checklist[i].value,
              text: checklist[i].label
            })
           this.contabs.push(checklist[i].value)
       }

   }
   console.log(tablist);
   this.tabs = tablist;

   if (!this.isshowTab) {
            this.isshowTab = true
        }
    console.log("this.contabs-->",this.contabs);
    if(this.contabs.length>1){
    	this.queryattr();

    }

  }




  formatattrlist(dd){
    let atattrlist = [];
    for(let i = 0;i<dd.length;i++){

        if(this.hasattr(atattrlist ,dd[i].attr_key)){

            this.updateattrlist(atattrlist,dd[i].attr_key,{id:dd[i].attr_value,dc:dd[i].attr_desc})
        }else{

            atattrlist.push({
              tunit:  dd[i].tran_config_part,
              tlable: dd[i].tran_ctl_desc,
              tattr : dd[i].attr_key,
              tattri: [{id:dd[i].attr_value,dc:dd[i].attr_desc}],
              tatype: dd[i].mark
            })
        }


    }
    console.log(dd)
    console.log('atattrlist------->')
    console.log(atattrlist)
    let controlArray1 = {};
    let localtab = this.tabs
    for(let i = 0; i < localtab.length;i++){
    	console.log("h1j1-->",localtab[i].id)
    	controlArray1[localtab[i].id] = [];
    }
    for(let i = 0 ; i < atattrlist.length;i++){
    	console.log(controlArray1[atattrlist[i].tunit])
    	if(atattrlist[i].tatype == '0'){
    		controlArray1[atattrlist[i].tunit].push({
	    	inputType: 'radio',
	    	nzSpan: '24',
	    	formsName: atattrlist[i].tattr,
	    	filedName: atattrlist[i].tlable,
	    	required: true,
	    	dictList: this.formatdictList(atattrlist[i].tattri,'radio'),
	    	isHideDel: true
	    	})
    	}else if(atattrlist[i].tatype == '1'){
    		controlArray1[atattrlist[i].tunit].push({
	    	inputType: 'checkbox',
	    	nzSpan: '24',
	    	formsName: atattrlist[i].tattr,
	    	filedName: atattrlist[i].tlable,
	    	required: true,
	    	dictList: this.formatdictList(atattrlist[i].tattri,'checkbox'),
	    	isHideDel: true
	    	})
    	}else{
    		controlArray1[atattrlist[i].tunit].push({
	    	inputType: 'input',
	    	nzSpan: '24',
	    	formsName: atattrlist[i].tattr,
	    	filedName: atattrlist[i].tlable,
	    	required: true,
	    	//dictId: 'SYS_BIZ_TYPE',
	    	isHideDel: true
	    	})
    	}



    }
    console.log("controlArray1---->",controlArray1)
    this.TcontrolArray = controlArray1;

  }
  hasattr(obj,ud){

    if(obj.find(function(value) {
        if(value.tattr == ud) {

             return true;
        }
    })){
        return true;
    }
    return false;

  }
  updateattrlist(obj,tuni,ud){
    obj.forEach(function(item){
        if(item['tattr']==tuni){
            item['tattri'].push(ud);
        }
    })
  }

  formatdictList(li,ftype){
  	let nli = []
  	if(ftype == 'checkbox'){
  		for(let i = 0 ;i<li.length;i++){
  			nli.push({
  			label: li[i].dc,
  			value: li[i].id
  			})
  		}
  	}else{
  		for(let i = 0 ;i<li.length;i++){
  			nli.push({
  			name: li[i].dc,
  			value: li[i].id
  			})
  		}
  	}
  	return nli;

  }


    tabSelect(tabId: string){
    	for(let i = 0;i<this.tabs.length;i++){
    		if(this.tabs[i].id == tabId ){
    			console.log("iii---->",i)
    			this.sindex = i;
    		}
    	}
    	console.log("TcontrolArray---->",this.TcontrolArray)
		this.controlArray = this.TcontrolArray[tabId]
		console.log("controlArray---->",this.controlArray)
    }

  queryunit(){
    TransCommonApiHelper.conditionQuery(this, "tranunitQuery", {
      tablename: "btf_tran_unit",
      page: "1",
      pagesize: "999",
      params:[{
            'logic': 'AND',
            'queryList': [{
              'logic': 'AND',
              'operator': 'EQ',
              'params':  ['is_availability','0']}]
          }]

    });
  }
  queryattr(){
    TransCommonApiHelper.conditionQuery(this, "tranattrQuery", {
      tablename: "btf_tran_attr_dict",
      page: "1",
      pagesize: "999",
      params:[{
            'logic': 'AND',
            'queryList': [{
              'logic': 'AND',
              'operator': 'IN',
              'params':  this.contabs}]
          }]
    })
  }

  customOutput(data: ServiceResult, tcFuncCode: string): void {

  }
  onTransactionContextChange(tcFuncCode: string, transactionContext: TransactionContext) {
    try{
      if (tcFuncCode === "tranunitQuery") {
        const resultData: ResultData = TransactionContextHelper.getServiceResult(
          transactionContext,
          tcFuncCode
        ).resultdata
        console.log(resultData)
        this.tabs = resultData.bdy.data.map(item => {

            return {
              id: item.tran_config_part,
              text: item.part_name
            }

        })
        this.contabs = ["tran_config_part"];
        resultData.bdy.data.map(item =>

              this.contabs.push(item.tran_config_part)

        )
        console.log(this.contabs)
        this.queryattr()
        this.sindex = 0;
        if (!this.isshowTab) {
            this.isshowTab = true
        }
        console.log(this.tabs)
        return
      }
      if (tcFuncCode === "tranattrQuery") {
        const resultData: ResultData = TransactionContextHelper.getServiceResult(
          transactionContext,
          tcFuncCode
        ).resultdata
        console.log('reswww->')
        console.log(resultData)
        this.formatattrlist(resultData.bdy.data)

        this.sindex = 0;
    	console.log("11111TcontrolArray---->",this.TcontrolArray)
    	this.controlArray = this.TcontrolArray[this.tabs[0].id];
    	console.log("11111controlArray---->",this.controlArray)

        return
      }
      const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);


    } finally {
      this.cd.markForCheck();
    }
  }



}




