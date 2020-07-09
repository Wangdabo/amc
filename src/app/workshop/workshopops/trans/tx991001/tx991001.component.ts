import {Component, OnInit, ViewChild} from '@angular/core';
import {
  BaseTransaction, ServiceTypeEnum, ShareParamsService, TransactionActionApiService, TransactionActionData,
  TransactionDefManager
} from 'tms-platform';
import {SettingService} from '../../../../service/setting.service';
import {FormComponent} from 'tms-platform-component';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-tx991001',
  templateUrl: './tx991001.component.html',
  styleUrls: ['./tx991001.component.css']
})
export class Tx991001Component extends BaseTransaction implements OnInit {

  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  transactionActionData: { [actionCode: string]: TransactionActionData };
  private currentEditApp: string;

  // 搜索数据
  queryHeader = [
    {label: '应用名称', value: 'app_name',  type: 'input',  filedType:  'string' },
    {label: '应用代码', value: 'app_code',  type: 'input',  filedType:  'string'},
    {label: '应用描述', value: 'app_desc',  type: 'input',  filedType:  'string'},
  ];
  // 表格所需数据
  header = [
    { key: 'app_name', label: '应用名称' },
    { key: 'app_code', label: '应用代码' },
    { key: 'app_desc', label: '应用描述' }
  ];

  isVisible = false;
  isUpdate  = false;
  // 头部按钮方法
  topActions = [
    {key: 'add', label: '新增', icon: 'plus', isHide: false}
  ];
  // 行内按钮方法
  rowActions = [
    { key: 'edit', label: '修改'  },
    { key: 'editPlugin', label: '插件管理'  },
    { key: 'delete', label: '删除'  },
  ];

  @ViewChild('pluginForm', {static: true})
  pluginForm: FormComponent;
  isPluginEditVisible = false;
  isPluginVisible = false;
  isPluginUpdate = false;
  // 头部按钮方法
  pluginTopActions = [
    {key: 'add', label: '新增', icon: 'plus', isHide: false}
  ];
  // 行内按钮方法
  pluginRowActions = [
    { key: 'edit', label: '修改'  },
    { key: 'delete', label: '删除'  },
  ];
  // 表格所需数据
  pluginHeader = [
    { key: 'name', label: '插件名称' },
    { key: 'code', label: '插件代码' },
    { key: 'app_name', label: '应用名称' },
    { key: 'file_name', label: '插件文件名' },
    { key: 'enter_code', label: '插件入口代码' },
    { key: 'part_name', label: '插件所属模块' }
  ];
  constructor(
    public settingService: SettingService,
    private shareParamsService: ShareParamsService,
    private modelService: NzModalService,
    private transactionActionApiService: TransactionActionApiService) {
    super(shareParamsService);
  }

  ngOnInit() {
    this.transactionActionData = this.transactionContextManager.getCurrentTransactionData(); // 获取交易上下文方法

    // 进入界面就提交一次主行为
     this.transactionActionApiService.submitMainAction();
  }
  getQueryData($event) {
    this.transactionActionData['query_app'].request.requestdata.bdy.data.params = $event;
    this.transactionActionApiService.submitMainAction();
  }
  // 重置方法
  reset($event) {
    this.getQueryData($event);
  }
  afterSubmit(actionCode: string) { // 钩子，拿到响应，如果不需要在ts里处理，可以直接在html中 双向绑定使用 transactionActionData
    switch (actionCode) {
      case 'createOrUpdate_app':
          this.transactionActionApiService.submitMainAction(); // 重新查询
        break;
      case 'delete_app':
          this.transactionActionApiService.submitMainAction(); // 重新查询
        break;
      case 'createOrUpdate_plugin':
        this.transactionActionApiService.submitAction('query_app_plugin'); // 重新查询
        break;
      case 'delete_plugin':
        this.transactionActionApiService.submitAction('query_app_plugin'); // 重新查询
        break;
    }
  }
  // 翻页方法
  pageChange($event) {
    this.transactionActionData['query_app'].request.requestdata.bdy.data.page = $event.pageIndex;
    this.transactionActionApiService.submitMainAction();
  }
  //  点击头部方法
  topActionsHandler($event) {
    switch ($event.key) {
      case 'add':
        this.isVisible = true;
        this.isUpdate = false;
        this.transactionActionData['createOrUpdate_app'].request.requestdata.bdy.data = {};
        break;
    }
  }
  // 关闭应用交易
  handleCancel(): void {
    this.isVisible = false;
  }
  /**
   * 新增修改对话框提交
   */
  handleOk(): void {
    this.transactionActionApiService.submitAction('createOrUpdate_app');
    this.isVisible = false;
  }
  // 点击行内方法
  rowActionsHandler($event) {
    switch ($event.key) {
      case 'edit':
        this.isVisible = true;
        this.isUpdate = true;
        this.transactionActionData['createOrUpdate_app'].request.requestdata.bdy.data = $event.item;
        break;
      case 'delete':
        this.modelService.confirm({
          nzTitle: '请确认删除', nzOnOk: () => {
            this.transactionActionData['delete_app'].request.requestdata.bdy.data['id'] = [$event.item['id']];
            this.transactionActionApiService.submitAction('delete_app');
          }
        });
        break;
      case 'editPlugin':
        this.pluginForm.disabled('app_name', true);
        this.isPluginVisible = true;
        this.currentEditApp = $event.item.app_code;
        this.transactionActionData['query_app_plugin'].request.requestdata.bdy.data.params[0].queryList[0].params[1] = $event.item.app_code;
        this.transactionActionApiService.submitAction('query_app_plugin');
        break;
    }
  }
  /**
   * 行为提交前钩子函数，一般在此处做表单校验
   */
  beforeSubmitCheck(actionCode: string): boolean {
    if (actionCode === 'createOrUpdate_app') {
      return this.baseForm.valid();
    }
    if (actionCode === 'createOrUpdate_plugin') {
      return this.pluginForm.valid();
    }
    return true;
  }

  // 插件头部方法
  pluginTopActionsHandler($event) {
    switch ($event.key) {
      case 'add':
        this.isPluginEditVisible = true;
        this.isPluginUpdate = false;
        this.transactionActionData['createOrUpdate_plugin'].request.requestdata.bdy.data = {app_name: this.currentEditApp};
        break;
    }
  }
  // 插件点击行内方法
  pluginRowActionsHandler($event) {
    switch ($event.key) {
      case 'edit':
        this.isPluginEditVisible = true;
        this.isPluginUpdate = true;
        this.transactionActionData['createOrUpdate_plugin'].request.requestdata.bdy.data = $event.item;
        break;
      case 'delete':
        this.modelService.confirm({
          nzTitle: '请确认删除', nzOnOk: () => {
            this.transactionActionData['delete_plugin'].request.requestdata.bdy.data['id'] = [$event.item['id']];
            this.transactionActionApiService.submitAction('delete_plugin');
          }
        });
        break;
    }
  }
  handlePluginCancel(): void {
    this.isPluginVisible = false;
  }
  handlePluginEditCancel(): void {
    this.isPluginEditVisible = false;
  }
  handlePluginOk(): void {
    this.transactionActionApiService.submitAction('createOrUpdate_plugin');
    this.isPluginEditVisible = false;
  }
}
// 注册交易
TransactionDefManager.registe({
  transCode: 'tx991001', // 交易代码
  transName: '应用管理', // 交易名称
  transActions: [
    {
      actionCode: 'createOrUpdate_plugin', // 行为码
      actionReqHead: { svcCode: '', funcCode: 'app_plugin_manage', serviceType: ServiceTypeEnum.VERSION }, // 请求头参数
      actionReqData: {bdy: { operatetype: 'createorupdate', data: {} } } // 请求体参数
    },
    {
      actionCode: 'delete_plugin', // 行为码
      actionReqHead: { svcCode: '', funcCode: 'app_plugin_manage', serviceType: ServiceTypeEnum.VERSION }, // 请求头参数
      actionReqData: {bdy: { operatetype: 'delete', data: {id: []} } } // 请求体参数
    },
    {
      actionCode: 'query_app_plugin', // 行为码
      actionReqHead: { svcCode: '', funcCode: 'app_plugin_manage', serviceType: ServiceTypeEnum.VERSION }, // 请求头参数
      actionReqData: {bdy: { operatetype: 'query', data: {params:[{
              'logic': 'AND',
              'queryList': [{
                'logic': 'AND',
                'operator': 'EQ',
                'params': ['app_name', '']
              }]
            }]} } } // 请求体参数
    },
    {
      actionCode: 'createOrUpdate_app', // 行为码
      actionReqHead: { svcCode: '', funcCode: 'app_manage', serviceType: ServiceTypeEnum.VERSION }, // 请求头参数
      actionReqData: {bdy: { operatetype: 'createorupdate', data: {} } } // 请求体参数
    },
    {
      actionCode: 'delete_app', // 行为码
      actionReqHead: { svcCode: '', funcCode: 'app_manage', serviceType: ServiceTypeEnum.VERSION }, // 请求头参数
      actionReqData: {bdy: { operatetype: 'delete', data: {id: []} } } // 请求体参数
    },
    {
      actionCode: 'query_app', // 行为码
      actionReqHead: { svcCode: '', funcCode: 'app_manage', serviceType: ServiceTypeEnum.VERSION }, // 请求头参数
      actionReqData: {bdy: { operatetype: 'query', data: {page: '1', pagesize: '10'} } } // 请求体参数
    }],
  mainActionCode: 'query_app' // 主行为，可使用F5调用
});
