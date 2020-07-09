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
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-tx990615',
  templateUrl: './tx990615.component.html',
  styleUrls: ['./tx990615.component.css']
})
export class Tx990615Component implements OnInit {

  constructor(
    private shareParamsService: ShareParamsService,
    public transactionActionApiService: TransactionActionApiService,
    private bsaApi: BsaApi,
    public router: Router,
    private message: NzMessageService
  ) {
   }
   sugesst = true; // 页面切换开关
   radioValue = 'A'; // 单选框
   listHeader = [
     {key: 'customer_name', label: '客户姓名'},
     {key: 'create_date', label: '建议日期'},
     {key: 'contact_number', label: '联系方式'},
     {key: 'summary', label: '建议摘要'},
     {key: 'registrant', label: '登记人'},
     {key: 'create_date', label: '登记日期'},
   ];
   customer_name = ''; // 客户姓名
   summary = ''; // 建议摘要
   summary_desc = ''; // 摘要详情
   contact_number = ''; // 联系方式
   create_date = ''; // 建议日期
   registrant = ''; // 登记人
   listData = [];
   condition  = {
     pagesize: 10,
     totalCount: 0,
     page: 1,
     isLoading: false
   };
   selectList($event) {

  }
  //  提交判断是否有空
  commit() {
    if (this.customer_name === '' || this.summary === '' || this.summary_desc === '' || this.contact_number === '' || this.create_date === '') {
      this.message.info('请填写完整');
    } else {
      this.addInfo();
      this.message.info('提交成功');
    }
  }
  // 新增记录
  addInfo() {
    let serviceRequest: ServiceRequest = {
      funccode: 'insertOrUpdate',
      svccode: 'TX001',
      svctype: '0',
      requestdata: {
        bdy: {
          'tablename': 'btf_demand_suggestion',
          'data': {
            'customer_name': this.customer_name,
            'summary': this.summary,
            'summary_desc': this.summary_desc,
            'contact_number': this.contact_number,
            'create_date': this.create_date,
            'registrant': JSON.parse(sessionStorage.getItem('user')).user_name,
            'processing_status': '处理中'
          }
        },
        coh: {},
        ctl: {
          'pageinfo': {
            'pagesize': this.condition.pagesize,
            'page': this.condition.page
          }
        }
        }
      };
    this.bsaApi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        console.log('添加数据成功');
      }
    });
    }
  // 重置
  result() {
    this.customer_name = '';
    this.summary = '';
    this.summary_desc = '';
    this.contact_number = '';
    this.create_date = '';
  }
  select($event) {
    console.log($event);
    if ($event === 'test1') {
      this.sugesst = true;
    } else if ($event === 'test2') {
      this.sugesst = false;
      this.getData();
    }
  }
  // 数据回显
  getData() {
    let serviceRequest: ServiceRequest = {
      funccode: 'conditionQuery',
      svccode: 'TX001',
      svctype: '0',
      requestdata: {
        bdy: {
          'tablename': 'btf_demand_suggestion',
          'page': '1',
          'pagesize': '10'
        },
        coh: {},
        ctl: {}
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        console.log(items);
        this.listData = items.resultdata.bdy.data;
        console.log('查询数据成功');
      }
    });
  }
  ngOnInit() {

  }

}