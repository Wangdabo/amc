import { Component, OnInit } from '@angular/core';
import { ServiceRequest, ServiceTypeEnum, BsaApi } from 'tms-platform';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-tx900617',
  templateUrl: './tx900617.component.html',
  styleUrls: ['./tx900617.component.css']
})
export class Tx900617Component implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
    private bsaApi: BsaApi,
    public router: Router,
    private notification: NzNotificationService) { }
  outletNumber: string; // 网点号
  selectedValue: string; // 排队号选择
  isVisible = false; // 指定叫号弹框
  header = [
    { key: 'order', label: '序号' },
    { key: 'bus_type', label: '业务类别', dictId: 'SYS_BUSINESS_TYPE' },
    {key: 'wait', label: '等待人数' },
    { key: 'max_time', label: '最长时间（分钟）' },
    { key: 'next', label: '优先号码' }
  ];


  bustypedetailheader = [
    { key: 'cust_name', label: '姓名' },
    { key: 'cust_gender', label: '性别' },
    {key: 'cust_age', label: '年龄' },
    {key: 'queue_no', label: '排队号' },
    {key: 'cust_no', label: '客户号', isclick: true },
    {key: 'cust_level', label: '客户等级' },
    { key: 'cust_manager', label: '主管' },
    { key: 'cust_phone', label: '手机号码' },
    { key: 'cust_mail', label: '电子邮箱' }
  ];
  
  bustypedetaillistData = []; // 信息
  bustypedetailrowActions = [];
  bustypedetailisVisible = false; // 客户详情
  topActions  = []; // 头部按钮数组
  rowActions = [{key: 'look', label: '客户信息'}]; // 行中按钮数组
  listData = [];  // 列表数据
  condition  = {
    pagesize: 10,
    totalCount: 0,
    page: 1,
    isLoading: false
  };
  selectRow: any; // 选中的表单类型

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.outletNumber = queryParams.outlet_number;
      this.getData(); // 查询网点排队详情
    });
  }
  getData(params?) {
    let serviceRequest: ServiceRequest = {
     funccode: 'queuedetail',
     svccode: 'TX550001',
     svctype: ServiceTypeEnum.TRANSACTION,
     requestdata: {
       bdy: {
        'params': params ? params : [],
         'tablename': 'btf_branch_queue',
         'orgcode': this.outletNumber
       },
       coh: {}
     }
   };
   this.bsaApi.asynCall(serviceRequest).subscribe(items => {
     if (items.returncode === '000000') {
      for (let i = 0; i < items.resultdata.bdy.data.length; i++) {
        items.resultdata.bdy.data[i].order = i + 1;
      }
      this.listData  = items.resultdata.bdy.data;
      this.condition.totalCount = items.resultdata.bdy.count;
     }
   });
 }

 // 查看人员详情
 bustypedetail(bustype) {
  let serviceRequest: ServiceRequest = {
    funccode: 'bustypedetail',
    svccode: 'TX550001',
    svctype: ServiceTypeEnum.TRANSACTION,
    requestdata: {
      bdy: {
       'params':  [],
        'tablename': 'btf_branch_queue',
        'orgcode': this.outletNumber,
        'bustype': bustype
      },
      coh: {}
    }
  };
  this.bsaApi.asynCall(serviceRequest).subscribe(items => {
    if (items.returncode === '000000') {
     this.bustypedetaillistData  = items.resultdata.bdy.data;
    }
  });
 }
 // 行内点击事件
 rowActionsHandler($event) {
    switch($event.key) {
      case 'look':
        this.bustypedetailisVisible = true; // 打开弹窗
        this.bustypedetail($event.item.bus_type)
        break;
    }
 }
  // 翻页数据
  pageChange($event) {
    this.condition.page = $event.pageIndex;
  }

  // 弹窗跳转
  bustypedetailrowrowActiveHandler($event) {
    // 跳转到固定界面
    this.router.navigate(['/gov/dashbord/tx990617'], {queryParams: {outlet_number: $event.org_code}});
  }

  // 选择类别
  selectRowsHandler($event) {
      this.selectRow = $event.selectRows;
  }

  // 刷新
  reset() {
    this.getData(); // 重新查询
  }

  // 指定叫号
  specifyvip() {
    if (this.selectRow && this.selectRow.length === 1) {
      this.isVisible = true; // 打开指定叫号弹框
    } else {
      this.notification.create('error', '操作失败' , '请必须选中一个类别进行指定');
    }
  }

  // 弹框确认
  submit($event) {
    // 调用指定排号方法
    let serviceRequest: ServiceRequest = {
      funccode: 'queuejump',
      svccode: 'TX550001',
      svctype: ServiceTypeEnum.TRANSACTION,
      requestdata: {
        bdy: {
         'params':  [],
          'tablename': 'btf_branch_queue',
          'orgcode': this.outletNumber,
          'queueno': this.selectedValue
        },
        coh: {}
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        this.notification.create('success', '操作成功', '指定叫号成功');
        this.getData(); // 重新调用查询方法，重新查询列表内容
        this.isVisible = false; // 关闭弹窗
      } else {
        this.notification.create('error', '指定失败', items.returnmessage);
      }
    });
  }

}
