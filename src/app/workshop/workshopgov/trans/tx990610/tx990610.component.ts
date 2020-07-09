import { Component, OnInit, ViewChild } from '@angular/core';
import {
  BaseTransaction,
  CommonActionCodeContants,
  ShareParamsService,
  TransactionActionApiService,
  TransactionActionData,
  TransactionActionDefManager,
  TransactionDefManager
} from 'tms-platform';
import { FormComponent } from 'tms-platform-component';
import { ContextService } from '../../../../workshop/context/context.service';
import { timingSafeEqual } from 'crypto';
import {BsaApi, DcsApi, NativeApi, ServiceRequest, ServiceTypeEnum} from 'tms-platform';
import { unsupported } from '@angular/compiler/src/render3/view/util';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'app-tx990610',
  templateUrl: './tx990610.component.html',
  styleUrls: ['./tx990610.component.css']
})
export class Tx990610Component  implements OnInit {

  constructor(
    private shareParamsService: ShareParamsService,
    public transactionActionApiService: TransactionActionApiService,
    private bsapi: BsaApi,
  ) {
   }
   total = 0;   //  总数据
   pageIndex = 1; // 当前页
   pageTotalNumber = 10;             // 指定每页显示多少条
   list = [];
   listHeader = [
     { key: 'id', label: '序号' },
     { key: 'device_code', label: '机具编号',  },
     { key: 'jnl_no', label: '流水号' },
     {
       key: 'card_no', label: '卡号'
     },
     {
       key: 'money_box_no', label: '钱箱号'
     },
     {
       key: 'reason', label: '吞卡原因'
     },
   ];
   queryHeader = [
    { label: '机具编号', value: 'device_code',  type: 'input',  filedType:  'string' },
    { label: '当前时间', value: 'create_time',  type: 'date',  filedType:  'string'},
    { label: '流水号', value: 'jnl_no',  type: 'input',  filedType:  'stri  ng'},
    { label: '卡号', value: 'card_no',  type: 'input',  filedType:  'string'},
    { label: '钱箱号', value: 'money_box_no',  type: 'input',  filedType:  'string'}
  ]
  ngOnInit() {
    this.getData([]);
  }
  pageChange = $event => {
    this.pageIndex = $event.pageIndex;
    this.getData(this.params);
  }
  params:any;
  getQueryData = ($event) => {
      console.log($event);
      this.params = $event;
      this.pageIndex = 1;
     this.getData(this.params);
  }
  reset = $event => {
    this.params = $event;
    this.pageIndex = 1;
    this.getData(this.params);
  }
  getData = (data) => {
    let serviceRequest: ServiceRequest = {
      'funccode': 'conditionQuery',
      'svccode': 'TX001',
      'svctype': '0',
      'requestdata': {
        'bdy': {
          'tablename': 'btf_stm_alert_msg',
          'page': this.pageIndex,
          'pagesize': this.pageTotalNumber,
          'params': data
        },
        'coh': {}
      }
    };
    console.log(serviceRequest);
    this.bsapi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        this.list = items.resultdata.bdy.data;
        this.total = items.resultdata.bdy.count;
        console.log( this.list);

      } else {
      }
    });
  }
}
