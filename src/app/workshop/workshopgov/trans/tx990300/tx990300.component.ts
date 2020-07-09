import {Component, OnInit, ViewChild} from '@angular/core';
import {
  BaseTransaction, CommonActionCodeContants, ShareParamsService, TransactionActionApiService, TransactionActionData,
  TransactionActionDefManager,
  TransactionDefManager
} from "tms-platform";
import {SettingService} from "../../../../service/setting.service";
import {FormComponent} from "tms-platform-component";;

@Component({
  selector: 'app-tx990300',
  templateUrl: './tx990300.component.html',
  styleUrls: ['./tx990300.component.css']
})
export class Tx990300Component extends BaseTransaction implements OnInit {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;

  constructor(
                public settingService: SettingService,
                private shareParamsService: ShareParamsService,
                private transactionActionApiService: TransactionActionApiService) {
    super(shareParamsService);
  }
  // 搜索数据
  queryHeader = [
      {label: '应用名称', value: 'app_name',  type: 'input',  filedType:  'string' },
      {label: '应用代码', value: 'app_id',  type: 'input',  filedType:  'string'},
      {label: '应用类型', value: 'app_type', type: 'select',  filedType:  'string', dictId: 'SYS_TYPE_APP'},
      {label: '应用状态', value: 'status',  type: 'select',  filedType:  'string', dictId: 'SYS_APP_STAUTS'},
      {label: '运行系统', value: 'app_os',  type: 'select',  filedType:  'string', dictId: 'SYS_APP_OS'},
      {label: '应用描述', value: 'app_desc',  type: 'input',  filedType:  'string'}
    ];
  // 表格所需数据
  header = [
    { key: 'app_id', label: '应用代码' },
    { key: 'app_name', label: '应用名称' },
    { key: 'app_type', label: '应用类型', dictId: 'SYS_TYPE_APP' },
    { key: 'api_key', label: '访问key' },
    { key: 'status', label: '应用状态', dictId: 'SYS_APP_STAUTS' },
    { key: 'secret_key', label: '秘钥'},
    { key: 'app_os', label: '运行系统', dictId: 'SYS_APP_OS'},
    {key: 'website', label: '网站地址' },
    { key: 'app_desc', label: '应用描述' },
    { key: 'create_time', label: '创建时间' }
    ];

  data = []; // 列表数据

  page: 1; // 当前页数
  pageSize: 10; // 每页条数
  totalCount: number; // 总数据
  isLoading = false; // loading 默认是false
  isVisible = false;
  isUpdate  = false;
  // 头部按钮方法
  topActions = [
    {key: 'add', label: '新增', icon: 'plus', isHide: false}
  ];
  // 行内按钮方法
  rowActions = [
    { key: 'eidt', label: '修改'  },
    { key: 'del', label: '删除'  },
  ];

  // 获取查询数据
  getQueryData($event) {
    this.transactionActionData[CommonActionCodeContants.QUERY].request.requestdata.bdy.params = $event;
    this.transactionActionApiService.submitMainAction();
  }

  // 重置方法
  reset($event) {
    this.getQueryData($event);
  }
  transactionActionData: { [actionCode: string]: TransactionActionData };

  ngOnInit() {
    this.transactionActionData = this.transactionContextManager.getCurrentTransactionData(); // 获取交易上下文方法
    // 进入界面就提交一次主行为
    this.transactionActionApiService.submitMainAction();
  }

  afterSubmit(actionCode: string) { // 钩子，拿到响应，如果不需要在ts里处理，可以直接在html中 双向绑定使用 transactionActionData
    console.log('afterSubmit 触发 actionCode = ' +  actionCode);
    switch (actionCode) {
      case 'common_query':
        break;
      case 'common_insert_or_update':
        if(this.transactionActionData['common_insert_or_update'].response['status'] === 0) {
          this.transactionActionApiService.submitMainAction(); // 重新查询
        }
        break;
        case 'common_delete':
        if(this.transactionActionData['common_delete'].response['status'] === 0) {
          this.transactionActionApiService.submitMainAction(); // 重新查询
        }
        break;
    }
  }

  // 翻页方法
  pageChange($event) {
    this.transactionActionData[CommonActionCodeContants.QUERY].request.requestdata.bdy.page = $event.pageIndex;
    this.transactionActionApiService.submitMainAction();
  }


  //  点击头部方法
  topActionsHandler($event) {
    switch ($event.key) {
      case 'add':
        this.isVisible = true;
        this.isUpdate = false;
        this.transactionActionData[CommonActionCodeContants.INSERT_OR_UPDATE].request.requestdata.bdy.data = {};
        break;
    }
  }

  // 关闭应用交易
  handleCancel() : void {
    this.isVisible = false;
  }

  /**
   * 新增修改对话框提交
   */
  handleOk(): void {
    this.transactionActionApiService.submitAction(CommonActionCodeContants.INSERT_OR_UPDATE); // 调用新增还是修改方法
    this.isVisible = false;
  }

  // 点击行内方法
  rowActionsHandler($event) {
    switch ($event.key) {
      case 'eidt':
        this.isVisible = true;
        this.isUpdate = true;
        this.transactionActionData[CommonActionCodeContants.INSERT_OR_UPDATE].request.requestdata.bdy.data = $event.item;
        break;
      case 'del':
        this.transactionActionData[CommonActionCodeContants.DELETE].request.requestdata.bdy['id'] = [$event.item['id']];
        this.transactionActionApiService.submitAction(CommonActionCodeContants.DELETE); // 调用登陆接口方法
        break;
    }
  }


  /**
   * 行为提交前钩子函数，一般在此处做表单校验
   */
  beforeSubmitCheck(actionCode: string): boolean {
    if (actionCode === CommonActionCodeContants.INSERT_OR_UPDATE) {
      return this.baseForm.valid();
    }
    return true;
  }


}

// 注册交易
TransactionDefManager.registe({
  transCode: 'tx990300', // 交易代码
  transName: '应用管理', // 交易名称
  /*  transActions: [
      {
      actionCode: 'query', // 行为码
      actionReqHead: { svcCode: 'TX001', funcCode: 'conditionQuery' }, // 请求头参数
      actionReqData: {bdy: { tablename: "btf_app", page: '1', length: '10' } } // 请求体参数
    },
      {
        actionCode: 'del', // 行为码
        actionReqHead: { svcCode: 'TX001', funcCode: 'delete' }, // 请求头参数
        actionReqData: {bdy: { id: [], tablename: "btf_app" } } // 请求体参数
      },
      {
        actionCode: 'update', // 行为码
        actionReqHead: { svcCode: 'TX001', funcCode: 'update' }, // 请求头参数
        actionReqData: {bdy: { data: {}, tablename: "btf_app" } } // 请求体参数
      },
      {
        actionCode: 'add', // 行为码
        actionReqHead: { svcCode: 'TX001', funcCode: 'add' }, // 请求头参数
        actionReqData: {bdy: { data: {}, tablename: "btf_app" } } // 请求体参数
      }],*/
  transActions: TransactionActionDefManager.createCrudActionDef({svcCode: 'TX001', tableName: 'btf_app'}), // 自动创建增删该查交易
  mainActionCode: CommonActionCodeContants.QUERY // 主行为，可使用F5调用
});
