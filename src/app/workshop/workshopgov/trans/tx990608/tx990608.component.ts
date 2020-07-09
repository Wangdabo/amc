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
import { NzModalService, NzNotificationService, isTemplateRef } from 'ng-zorro-antd';
@Component({
  selector: 'app-tx990608',
  templateUrl: './tx990608.component.html',
  styleUrls: ['./tx990608.component.css']
})
export class Tx990608Component  implements OnInit {
  constructor(
    private shareParamsService: ShareParamsService,
    public transactionActionApiService: TransactionActionApiService,
    private workShopContextService: ContextService,
    private bsApi: BsaApi,
    private notificationService: NzNotificationService,
    private modal: NzModalService
  ) {
  }
  @ViewChild('baseForm', { static: true })
  baseForm: FormComponent;
  // 头部按钮方法
  topActions = [
    { key: 'add', label: '新增', icon: 'plus', isHide: false },
    { key: 'delete', label: '批量删除', type: 'default', isHide: true }];
  listText = {}; // 搜索条件
  branchValue: string; // 搜索条件网点值
  // 行内按钮方法
  rowActions = [
    { key: 'del', label: '删除' },
    {
      key: 'update', label: '修改'
    }
  ];
  pageSize = 10;
  totalCount: number;
  // 数据获取
  transactionActionData: { [actionCode: string]: TransactionActionData };
  // 社保卡，借记卡，信用卡
  cardType = [
       { name: '烟花卡普通卡', value: 'CCHA' },
       { name: '牡丹灵通卡', value: 'CCHB' },
       { name: '理财金账户卡', value: 'CCHC' },
       { name: '财富卡', value: 'CCHD' },
  ];
  isVisible = false; // 新增模态框是否显示
  listData = [
  ];
  addData = {
    type: '',
    netNumber: '',
    netName: '',
    boxNumber: '',
    warnNumber: ''
  }
  queryHeader = [{
    label: '网点号',
    value: this.branchValue,
    type: 'input',
    filedType: 'string'
  },]
  listHeader = [
    { key: 'index', label: '序号' },
    { key: 'ibc_type', label: '重空类型',  dictSelect:[
      { name: '烟花卡普通卡', value: 'CCHA' },
      { name: '牡丹灵通卡', value: 'CCHB' },
      { name: '理财金账户卡', value: 'CCHC' },
      { name: '财富卡', value: 'CCHD' },
    ]},
    { key: 'org_code', label: '网点号' },
    {
      key: 'org_name_join', label: '网点名称'
    },
    {
      key: 'money_box_no', label: '钱箱号'
    },
    {
      key: 'threshold_num', label: '预警数'
    },
  ];
  // 翻页方法
  indexPage = 1; // 当前页
  listId = [];
  ngOnInit() {
    this.getQueryData();
   }
  // 搜索数据
  getQueryData = () => {
    let serviceRequest: ServiceRequest;
    if (this.branchValue === '' || this.branchValue === null || this.branchValue === undefined) {
      serviceRequest = {
        'funccode': 'conditionQuery',
        'svccode': 'TX001',
        svctype: '0',
        'requestdata': {
          'bdy': {
            'tablename': 'btf_ibc_threshold',
            'page': this.indexPage,
            'pagesize': this.pageSize,
            "joinOps":[{"joinTable":"btf_org_info","queryJoinFields":[{"fieldName":"org_name","alias":"org_name_join"}],"mainField":"org_code","joinField":"org_code"}],
            'params': [
              {
                'logic': 'AND',
                'queryList': [
                ]
              }
            ]
          },
          'coh': {}
        }
    };
    } else {
      serviceRequest = {
        'funccode': 'conditionQuery',
        'svccode': 'TX001',
        svctype: '0',
        'requestdata': {
          'bdy': {
            'tablename': 'btf_ibc_threshold',
            'page': this.indexPage,
            'pagesize': this.pageSize,
            "joinOps":[{"joinTable":"btf_org_info","queryJoinFields":[{"fieldName":"org_name","alias":"org_name_join"}],"mainField":"org_code","joinField":"org_code"}],
            'params': [
              {
                'logic': 'AND',
                'queryList': [ {
                  'logic': 'AND',
                  'operator': 'EQ',
                  'params': [
                    'org_code', this.branchValue
                  ]
                }
                ]
              }
            ]
          },
          'coh': {}
        }
    };
    }
  this.bsApi.asynCall(serviceRequest).subscribe(items => {
    if (items.returncode === '000000') {
          this.totalCount = items.resultdata.bdy.count;
          this.listData = items.resultdata.bdy.data.map((item, index) => (
            {index: this.pageSize * (this.indexPage - 1) + index + 1, ...item}
            ));
          this.notificationService.success('成功', '查询成功');
        } else {
          this.notificationService.error('失败', '查询失败');
        }
  });
  }
  // 重置
  reset = () => {
    this.branchValue = undefined;
    this.getQueryData();
  }
  pageChange($event) {
    console.log($event.pageIndex);
    this.indexPage = $event.pageIndex;
    this.getQueryData();
  }
  // 点击行内方法
  isUpdate = false;
  id:string = '';
  rowActionsHandler($event) {
    switch ($event.key) {
      case 'del':
        this.modal.confirm({
          nzTitle: '请确认删除', nzOnOk: () => {
            this.listId = [];
            this.listId.push($event.item.id);
            this.deleteData(this.listId);
          }
        });
        break;
      case 'update': 
      this.isVisible = true;
      this.isUpdate = true;
      setTimeout(() => {
        this.baseForm.setValue('ibc_type', $event.item.ibc_type);
        this.baseForm.setValue('org_code', $event.item.org_code);
        this.baseForm.setValue('money_box_no', $event.item.money_box_no);
        this.baseForm.setValue('threshold_num', $event.item.threshold_num);
        this.id = $event.item.id;
      }, );
      console.log(this.baseForm.getData());
      console.log($event);
      break;
    }
  }
  //  点击头部方法
  topActionsHandler($event) {
    if ($event.key === 'delete') {
      this.deleteMore();
    } else if ($event.key === 'add') {
      this.isVisible = true;
      this.isUpdate = false;
      this.baseForm.initData();
    }
  }
  // 关闭应用交易
  handleCancel(): void {
    this.isVisible = false;
    this.baseForm.initData();
  }
  /**
* 新增修改对话框提交
*/
  handleOk(): void {
    this.isVisible = false;
    console.log(this.isUpdate);
    if (this.isUpdate) {
      this.updateOrgData();
    } else {
      this.addOrgData();
    }
    // 调用新增接口
  }
  addOrgData = () => {
    const serviceRequest: ServiceRequest = {
      'funccode': 'insertOrUpdate',
      'svccode': 'TX001',
      svctype: '0',
      'requestdata': {
        'bdy': {
          'tablename': 'btf_ibc_threshold',
            'data': {
              ...this.baseForm.getData() ,
            }
        },
        'coh': {}
      }
  };
  console.log(this.baseForm.getData())
  this.bsApi.asynCall(serviceRequest).subscribe(items => {
    if (items.returncode === '000000') {
      this.notificationService.success('成功', '新增成功');
      this.reset();
    } else {
      this.notificationService.error('失败', '新增失败');
    }
  });
  }
  updateOrgData = () => {
    const serviceRequest: ServiceRequest = {
      'funccode': 'insertOrUpdate',
      'svccode': 'TX001',
      svctype: '0',
      'requestdata': {
        'bdy': {
          'tablename': 'btf_ibc_threshold',
            'data': {
              ...this.baseForm.getData() ,
              id: this.id
            }
        },
        'coh': {}
      }
  };
  console.log(this.baseForm.getData())
  this.bsApi.asynCall(serviceRequest).subscribe(items => {
    if (items.returncode === '000000') {
      this.notificationService.success('成功', '修改成功');
      this.reset();
    } else {
      this.notificationService.error('失败', '修改失败');
    }
  });
  }
  deleteData = (i) => {
    const serviceRequest: ServiceRequest = {
        'funccode': 'delete',
        'svccode': 'TX001',
        svctype: '0',
        'requestdata': {
          'bdy': {
            'id': this.listId,
            'tablename': 'btf_ibc_threshold'
          },
          'coh': {}
        }
  };
  console.log(serviceRequest);

  this.bsApi.asynCall(serviceRequest).subscribe(items => {
    if (items.returncode === '000000') {
      this.notificationService.success('成功', '删除成功');
      if (this.indexPage !== 1) {
        this.indexPage = 1;
      }
      this.reset();
    } else {
      this.notificationService.error('失败', '删除失败');
    }
  });
  }
  private selectRows: Array<any>;

  // 批量删除
  selectRowsHandler($event): void {
    if ($event.selectRows.length > 0) {
      this.topActions[1].isHide = false;
    } else {
      this.topActions[1].isHide = true;
    }
    this.selectRows = $event.selectRows;
  }
  deleteMore = () => {
    this.modal.confirm({
      nzTitle: '请确认批量删除', nzOnOk: () => {
        this.listId.length = 0.;
        this.selectRows.forEach(item => this.listId.push(item.id));
        this.deleteData(this.listId);
      }
    });
  }
}

