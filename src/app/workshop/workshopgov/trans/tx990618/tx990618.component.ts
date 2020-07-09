import { Component, OnInit, ViewChild } from '@angular/core';
import {
  BaseTransaction,
  CommonActionCodeContants,
  ShareParamsService,
  TransactionActionApiService,
  TransactionActionData,
  TransactionActionDefManager,
  TransactionDefManager,
  HttpService
} from 'tms-platform';
import { FormComponent } from 'tms-platform-component';
import { ContextService } from '../../../../workshop/context/context.service';
import { timingSafeEqual } from 'crypto';
import {BsaApi, DcsApi, NativeApi, ServiceRequest, ServiceTypeEnum} from 'tms-platform';
import { unsupported } from '@angular/compiler/src/render3/view/util';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { GlobalService } from 'src/app/service/global.service';
@Component({
  selector: 'app-tx990618',
  templateUrl: './tx990618.component.html',
  styleUrls: ['./tx990618.component.css']
})
export class Tx990618Component  implements OnInit {

  constructor(
    private HttplinkService: HttpService,
    public transactionActionApiService: TransactionActionApiService,
    private global: GlobalService,
  ) {
   }
   total = 0;   //  总数据
   pageIndex = 1; // 当前页
   pageTotalNumber = 10;             // 指定每页显示多少条
   list = [{
    org_work_status:'1',org_status:'0'
   }];
     listHeader = [
        { key: 'org_work_status', label: '工作状态', dictSelect: [
            { name: '营业', value: '0' },
            { name: '签退', value: '1' },
          ] },
        { key: 'org_status', label: '机构状态'},
        { key: 'cash_user_cnt', label: '现金内库柜员数量' },
        ,
        {
          key: 'org_name', label: '机构名称'
        },
        {
          key: 'org_code', label: '网点机构代码'
        },
        {
            key: 'mcctl_user_cnt', label: '重空内库柜员数量'
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
      let serviceRequest: ServiceRequest;
        serviceRequest = {
            'funccode': 'list',
            'svccode': 'TP550000',
            svctype: '0',
            'requestdata': {
              'bdy': {},
              'coh': {},
              'ctl': {
                  'pageinfo': {
                      'page': '1',
                      'pagesize': '10'
                  }
              }
            }
        };
    const option = JSON.stringify( serviceRequest);
        this.HttplinkService.post( this.global.ipserver + '/cust/customer', option).subscribe(items => {
            console.log(items['resultdata']['bdy']['data']);
        if (items['returncode'] === '000000') {
            this.total = items['resultdata']['bdy']['count'];
            this.list = items['resultdata']['bdy']['data'];
        }
      });
  }
}
