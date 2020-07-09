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
import { Router } from '@angular/router';
@Component({
  selector: 'app-tx990616',
  templateUrl: './tx990616.component.html',
  styleUrls: ['./tx990616.component.css']
})
export class Tx990616Component  implements OnInit {

  constructor(
    private bsaApi: BsaApi,
    public router: Router
  ) {
   }
   outletNumber: string; // 网点号
   header = [
    { key: 'org_code', label: '网点号', isclick: true },
    { key: 'org_name', label: '网点名称' },
    {key: 'wait', label: '排队人数' },
    { key: 'avg', label: '已办理人数' },
    { key: 'done', label: '平均等候时间（分)' }
  ];

  topActions  = []; // 头部按钮数组
  rowActions = []; // 行中按钮数组
  listData = [];  // 列表数据
  condition  = {
    pagesize: 10,
    totalCount: 0,
    page: 1,
    isLoading: false
  };
  ngOnInit() {
    this.getData();
  }
 // 查询方法
  getData(params?) {
     const serviceRequest: ServiceRequest = {
      funccode: 'queuelist',
      svccode: 'TX550001',
      svctype: ServiceTypeEnum.TRANSACTION,
      requestdata: {
        bdy: {
          'params': params ? params : [],
          'tablename': 'btf_branch_queue'
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
        this.listData  = items.resultdata.bdy.data;
        this.condition.totalCount = items.resultdata.bdy.count;
      }
    });
  }


    /* 翻页方法 */
    pageChange($event) {
      this.condition.page = $event.pageIndex;
      this.getData(); // 重新查询
    }

    // 跳转
    rowActiveHandler($event) {
      console.log($event);
        this.router.navigate(['/gov/dashbord/tx900617'], {queryParams: {outlet_number: $event.org_code}});
    }

    orgQuery(orgcode) {
        const serviceRequest: ServiceRequest = {
        funccode: 'queuesearch',
        svccode: 'TX550001',
        svctype: ServiceTypeEnum.TRANSACTION,
        requestdata: {
          bdy: {
            'tablename': 'btf_branch_queue',
            'orgcode': orgcode
          },
          coh: {}
        }
      };
      this.bsaApi.asynCall(serviceRequest).subscribe(items => {
        if (items.returncode === '000000') {
          this.listData  = items.resultdata.bdy.data;
          this.condition.totalCount = items.resultdata.bdy.count;
        }
      });
    }


    searchoutlet($event) {
      if ($event) {
        // 调用查询方法
        this.orgQuery($event);
      } else {
        this.getData();
      }
    }
}

// 注册交易
TransactionDefManager.registe({
    transCode: 'tx990616', // 交易代码
    transName: '排队管理', // 交易名称
    transActions: [], // 自动创建增删该查交易
    mainActionCode: '' // 主行为，可使用F5调用
  });
