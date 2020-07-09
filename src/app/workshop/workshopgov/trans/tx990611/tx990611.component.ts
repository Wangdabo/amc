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
  selector: 'app-tx990611',
  templateUrl: './tx990611.component.html',
  styleUrls: ['./tx990611.component.css']
})
export class Tx990611Component implements OnInit {

  constructor(
    private shareParamsService: ShareParamsService,
    public transactionActionApiService: TransactionActionApiService,
    private bsaApi: BsaApi,
    public router: Router,
    private message: NzMessageService
  ) {
   }
   sugesst = true;
  radioValue = 'A';
  listHeader = [
    { key: 'customer_name', label: '客户姓名' },
    { key: 'complaint_time', label: '投诉日期' },
    { key: 'complained_employee', label: '被投诉员工' },
    { key: 'complaint_reason', label: '投诉事由' },
    { key: 'processing_state', label: '处理状态' },
  ];
  customer_name = '';
  contact_number = '';
  complaint_time = '';
  complaint_reason = '';
  complained_employee = '';
  employee_post = '';
  processing_state = '';
  acceptance_channels = '';
  listData = [];
  condition = {
    pagesize: 10,
    totalCount: 0,
    page: 1,
    isLoading: false
  };
  ngOnInit() {

  }
  selectList($event) {

  }
  // 提交校验
  commit() {
    if (this.customer_name === '' || this.contact_number === '' || this.complaint_time === '' ||
      this.complaint_reason === '' || this.complained_employee === '' || this.employee_post === '' || this.processing_state === ''
      || this.acceptance_channels === '') {
        this.message.info('请填写完整');
    } else {
      this.addInfo();
      this.message.info('提交成功');
    }
  }
  // 新增
  addInfo() {
    let serviceRequest: ServiceRequest = {
      funccode: 'insertOrUpdate',
      svccode: 'TX001',
      svctype: '0',
      requestdata: {
        bdy: {
          'tablename': 'btf_customer_complaints',
          'data': {
            'customer_name': this.customer_name,
            'contact_number': this.contact_number,
            'complaint_time': this.complaint_time,
            'complaint_reason': this.complaint_reason,
            'complained_employee': this.complained_employee,
            'employee_post': this.employee_post,
            'processing_state': this.processing_state,
            'acceptance_channels': this.acceptance_channels
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
    this.contact_number = '';
    this.complaint_time = '';
    this.complaint_reason = '';
    this.complained_employee = '';
    this.employee_post = '';
    this.processing_state = '';
    this.acceptance_channels = '';
  }
  // 头部单选框选择
  select($event) {
    console.log($event);
    if ($event === 'test1') {
      this.sugesst = true;
    } else if ($event === 'test2') {
      this.sugesst = false;
      this.getData();
    }
  }
  // 查询数据
  getData() {
    let serviceRequest: ServiceRequest = {
      funccode: 'conditionQuery',
      svccode: 'TX001',
      svctype: '0',
      requestdata: {
        bdy: {
          'tablename': 'btf_customer_complaints',
          'page': '1',
          'pagesize': '10'
        },
        coh: {},
        ctl: {}
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        this.listData = items.resultdata.bdy.data;
        console.log('添加数据成功');
      }
    });
  }

}
