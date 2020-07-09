import { Component, OnInit, ViewChild } from '@angular/core';
import {
  BaseTransaction, CommonActionCodeContants, ServiceTypeEnum, ShareParamsService, TransactionActionApiService, TransactionActionData,
  TransactionActionDefManager,
  TransactionDefManager
} from 'tms-platform';
import { SettingService } from '../../../../service/setting.service';
import { FormComponent } from 'tms-platform-component';
import { NzModalService } from 'ng-zorro-antd';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tx991002',
  templateUrl: './tx991002.component.html',
  styleUrls: ['./tx991002.component.css']
})
export class Tx991002Component extends BaseTransaction implements OnInit {
  initFinish;
  isVisible = false;
  @ViewChild('baseForm', { static: true })
  baseForm: FormComponent;
  transactionActionData: { [actionCode: string]: TransactionActionData };
  detailItem: any = {};
  // 搜索数据
  queryHeader = [
  ];
  dataList = []
  // 表格所需数据
  header = [
    { key: 'version_no', label: '版本号' },
    { key: 'app_name', label: '发版应用' },
    { key: 'version_status', label: '版本状态', dictSelect: [{ name: '已发布', value: '1' }] },
    { key: 'version_effect_time', label: '版本发布时间' },
  ];

  // 头部按钮方法
  topActions = [
    { key: 'publish', label: '发布新版本', icon: 'plus', isHide: false }
  ];
  // 行内按钮方法
  rowActions = [
    { key: 'detail', label: '详情' },
  ];
  loading = false;
  constructor(
    public settingService: SettingService,
    private shareParamsService: ShareParamsService,
    private modelService: NzModalService,
    public activatedRoute: ActivatedRoute,
    private transactionActionApiService: TransactionActionApiService) {
    super(shareParamsService);
  }

  ngOnInit() {
    this.transactionActionData = this.transactionContextManager.getCurrentTransactionData(); // 获取交易上下文方法

    // 进入界面就提交一次主行为
    this.transactionActionApiService.submitMainAction();
    this.transactionActionApiService.submitAction('queryApp');
    this.initFinish = true;
  }
  getQueryData($event) {
    this.transactionActionData['query'].request.requestdata.bdy.data.params = $event;
    this.transactionActionApiService.submitMainAction();
  }
  // 重置方法
  reset($event) {
    this.getQueryData($event);
  }
  afterSubmit(actionCode: string) { // 钩子，拿到响应，如果不需要在ts里处理，可以直接在html中 双向绑定使用 transactionActionData
    switch (actionCode) {
      case 'publish':
        this.transactionActionApiService.submitMainAction(); // 重新查询
        break;
      case 'queryApp':
        // 初始化第一个TAB数据
        const appCode = this.transactionActionData['queryApp'].response.resultdata.bdy.data[0].app_code;
        this.transactionActionData['appLatestVersionQuery'].request.requestdata.bdy.appname = appCode;
        this.transactionActionApiService.submitAction('appLatestVersionQuery');
        break;
      case 'appLatestVersionQuery':
        this.dataList = this.transactionActionData['appLatestVersionQuery'].response.resultdata.bdy;
      break;
    }
  }
  // 翻页方法
  pageChange($event) {
    this.transactionActionData['query'].request.requestdata.bdy.currentPage = $event.pageIndex;
    this.transactionActionApiService.submitMainAction();
  }
  //  点击头部方法
  topActionsHandler($event) {
    switch ($event.key) {
      case 'publish':
        this.transactionActionData['publish'].request.requestdata.bdy.versioninfo = { version_status: '1' };
        this.transactionActionData['publish'].request.requestdata.bdy.moduleList = [];
        this.transactionActionApiService.routeChildren('publish', this.activatedRoute);
        break;
    }
  }
  // 关闭应用交易
  handleCancel(): void {
    this.isVisible = false;
  }

  // 点击行内方法
  rowActionsHandler($event) {
    switch ($event.key) {
      case 'detail':
        this.isVisible = true;
        this.detailItem = $event.item;
        this.transactionActionData['detail'].request.requestdata.bdy.version_id = $event.item.id;
        this.transactionActionApiService.submitAction('detail');
        break;
    }
  }
  appChange(appCode) {
    this.transactionActionData['appLatestVersionQuery'].request.requestdata.bdy.appname = appCode;
    this.transactionActionApiService.submitAction('appLatestVersionQuery');
  }
}
// 注册交易
TransactionDefManager.registe({
  transCode: 'tx991002', // 交易代码
  transName: '客户端版本发布', // 交易名称
  transActions: [
    {
      actionCode: 'query', // 行为码
      actionReqHead: { svcCode: '', funcCode: 'versioninfo', serviceType: ServiceTypeEnum.VERSION }, // 请求头参数
      actionReqData: { bdy: { currentPage: 1, itemsperpage: 10, workstation_type: 'client' } } // 请求体参数
    },
    {
      actionCode: 'detail', // 行为码
      actionReqHead: { svcCode: '', funcCode: 'version_module_query', serviceType: ServiceTypeEnum.VERSION }, // 请求头参数
      actionReqData: { bdy: { version_id: '' } } // 请求体参数
    },
    {
      actionCode: 'appLatestVersionQuery', // 行为码
      actionReqHead: { svcCode: '', funcCode: 'latest_module_query', serviceType: ServiceTypeEnum.VERSION }, // 请求头参数
      actionReqData: { bdy: { appname: '' } } // 请求体参数
    }],
  mainActionCode: 'query' // 主行为，可使用F5调用
});
TransactionDefManager.addActionDefs('tx991002', [
  {
    actionCode: 'publish', // 行为码
    actionReqHead: { svcCode: '', funcCode: 'version_publish_h5', serviceType: ServiceTypeEnum.VERSION }, // 请求头参数
    actionReqData: { bdy: { versioninfo: {}, moduleList: [] } } // 请求体参数
  }, {
    actionCode: 'queryPlugin', // 行为码
    actionReqHead: { svcCode: '', funcCode: 'app_plugin_manage', serviceType: ServiceTypeEnum.VERSION }, // 请求头参数
    actionReqData: {
      bdy: {
        operatetype: 'query', data: {
          params: [{
            logic: 'AND',
            queryList: [{
              logic: 'AND',
              operator: 'EQ',
              params: ['app_name', '']
            }]
          }]
        }
      }
    } // 请求体参数
  }, {
    actionCode: 'queryApp', // 行为码
    actionReqHead: { svcCode: '', funcCode: 'app_manage', serviceType: ServiceTypeEnum.VERSION }, // 请求头参数
    actionReqData: { bdy: { operatetype: 'query', data: {} } } // 请求体参数
  }]);
