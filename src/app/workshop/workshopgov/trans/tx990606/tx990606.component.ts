import { Component, OnInit, ViewChild } from '@angular/core';
import {
  BaseTransaction, CommonActionCodeContants, ShareParamsService, TransactionActionApiService, TransactionActionData,
  TransactionActionDefManager,
  TransactionDefManager
} from "tms-platform";
import { FormComponent } from "tms-platform-component";
import {ContextService} from "../../../../workshop/context/context.service";

@Component({
  selector: 'app-tx990606',
  templateUrl: './tx990606.component.html',
  styleUrls: ['./tx990606.component.css']
})
export class Tx990606Component extends BaseTransaction implements OnInit {

  @ViewChild('baseForm', { static: true })
  baseForm: FormComponent;
  constructor(
    private shareParamsService: ShareParamsService,
    public transactionActionApiService: TransactionActionApiService,
    private workShopContextService: ContextService) {
    super(shareParamsService);
  }

  page: 1; // 当前页数
  pageSize: 10; // 每页条数
  totalCount: number; // 总数据
  modalTitle: string; // 弹框标题内容
  isLoading = false; // loading 默认是false
  isVisible = false;
  isUpdate = false;
  isExit = false;
  Visible = false;
  expression = false;
  msgData:any;
  value:string = '';//文本框内容
  text4 = [];//机构名称
  // text1 = [];
  text3 = [];//角色名称
  text2 = [];//用户名称
  userCode:string;
  flag: any;//modal框内
  flags = true;//头部
  Item:any;
  time: any;
  time2: any
  // 消息状态
  optionArray1 = [
    { name: '拟稿', value: '0' },
    { name: '发布', value: '1' }
  ];
  // 消息类型
  optionArray2 = [
    { name: '服务信息', value: '0' },
    { name: '安全信息', value: '1' },
    { name: '产品信息', value: '2' }
  ];
  // 消息接收范围
  optionArray3 = [
    { name: '全体人员', value: '0' },
    { name: '自定义', value: '1' }
  ];
  // 头部按钮方法
  topActions = [
    { key: 'add', label: '新增', icon: 'plus', isHide: false }
  ];
  // 行内按钮方法
  rowActions = [
    { key: 'eidt', label: '编辑' },
    { key: 'issue', label: '更改状态' },
    { key: 'del', label: '删除' },
  ];
  // 头部查询
  queryHeader =[
    {name:'标题',value:'msg_info_title'},
    {name:'消息状态',value:'msg_info_status'}
  ]
  listText = {}
  listHeader = [
    { key: 'id', label: '序号' },
    { key: 'msg_info_title', label: '标题' ,isclick:true},
    { key: 'create_date', label: '创建时间' },
    {
      key: 'msg_info_status', label: '消息状态', dictSelect: [
        { name: '拟稿中', value: '0' },
        { name: '已发布', value: '1' },
        { name: '已撤回', value: '2' }
      ]
    },
  ];
  // 机构
  listHeader2 = [
    { key: 'org_name', label: '机构名称' },
    { key: 'org_code', label: '机构代码' },
    { key: 'org_type', label: '机构类型' },
    { key: 'org_status', label: '机构状态' },
    { key: 'org_work_status', label: '工作状态' },
  ]
  listData2 = [];


  // 角色
  listHeader3 = [
    { key: 'role_code', label: '角色代码' },
    { key: 'role_name', label: '角色名称' },
    { key: 'valid_flag', label: '有效状态' },
    { key: 'auth_level', label: '授权级别' },
    { key: 'auth_edu_min', label: '最小授权额度' },
    { key: 'auth_edu_max', label: '最大授权额度' },
    { key: 'admin_level', label: '允许管理员级别' },
    { key: 'allow_biz_range', label: '允许应用级别' }
  ]
  listData3 = []
  // 用户
  listHeader4 = [
    { key: 'user_code', label: '用户代码', isclick: true },
    { key: 'user_name', label: '用户名称' },
    { key: 'user_type', label: '用户类型' },
    { key: 'org_code', label: '工作机构代码' },
    { key: 'user_status', label: '用户状态' },
    { key: 'work_status', label: '工作状态' }
  ]
  listData4 = []
  titleValue: any;
  valueInfo: any;

  // 数据获取
  transactionActionData: { [actionCode: string]: TransactionActionData };

  //获取查询数据
  getQueryData() {
    this.listText[this.titleValue] = this.valueInfo;
    this.transactionActionData['query'].request.requestdata.bdy.condition = this.listText;
    this.transactionActionApiService.submitAction('query');
  }
  
  // 重置方法
  reset() {
    this.titleValue = undefined;
    this.valueInfo = undefined;
    this.transactionActionData['query'].request.requestdata.bdy.condition = {};
    this.selectCode('query');
    this.transactionActionApiService.submitAction('query');
  }
  ngOnInit() {
    this.userCode  = this.workShopContextService.getUserInfo().user_code;
    console.log(this.userCode)
    this.transactionActionData = this.transactionContextManager.getCurrentTransactionData(); // 获取交易上下文方法
    // 进入界面就提交一次主行为
    this.selectCode('query')
    this.transactionActionApiService.submitAction('query');
  }
  afterSubmit(actionCode: string) { // 钩子，拿到响应，如果不需要在ts里处理，可以直接在html中 双向绑定使用 transactionActionData
    console.log('afterSubmit 触发 actionCode = ' + actionCode);
    console.log(this.transactionActionData)
    switch (actionCode) {
      case 'queryDetail':
        console.log(this.transactionActionData['queryDetail'].response.resultdata.bdy.data.orgs)
        if(this.transactionActionData['queryDetail'].response.resultdata.bdy.data.orgs) {
          this.text4 = this.transactionActionData['queryDetail'].response.resultdata.bdy.data.orgs;
          this.text3 = this.transactionActionData['queryDetail'].response.resultdata.bdy.data.roles;
          this.text2 = this.transactionActionData['queryDetail'].response.resultdata.bdy.data.users;
        }
        console.log(this.text3)
        console.log(this.text2)
        this.value = this.transactionActionData['queryDetail'].response.resultdata.bdy.data.msg_info_data;
        this.msgData = this.transactionActionData['queryDetail'].response.resultdata.bdy.data.msg_info_data;
        break;
      case 'queryOrg':
        this.listData2 = this.transactionActionData['queryOrg'].response.resultdata.bdy.data;
        break;
      case 'queryRole':
        this.listData3 = this.transactionActionData['queryRole'].response.resultdata.bdy.data;
        break;
      case 'queryUser':
        this.listData4 = this.transactionActionData['queryUser'].response.resultdata.bdy.data;
        break;
      case 'saveOrUpdate':
        console.log('刷新成功')
        this.selectCode('query');
        this.transactionActionApiService.submitAction('query');
        break;
      case 'updateStatus':
        this.selectCode('query');
        this.transactionActionApiService.submitAction('query');
        break;
    }
  }

  // 翻页方法
  pageChange($event) {
    console.log($event.pageIndex)
    this.transactionActionData['query'].request.requestdata.bdy.page = $event.pageIndex;
    this.selectCode('query');
    this.transactionActionApiService.submitAction('query');
  }
  //  点击头部方法
  topActionsHandler($event) {
    switch ($event.key) {
      case 'add':
        this.Item = 'add';
        this.text4 = [];
        this.text3 = [];
        this.text2 = [];
        this.isVisible = true;
        this.isUpdate = false;
        this.value = '';
        this.transactionActionData['saveOrUpdate'].request.requestdata.bdy.item = {};
        break;
    }
  }

  addItem(item) {
    switch (item){
      case 'orgs':
        this.expression = true;
        this.isExit = true;
        this.isVisible = false;
        this.flag = 'org';
        this.modalTitle = '选择机构';
        this.selectCode('queryOrg');
        this.transactionActionApiService.submitAction('queryOrg');
        break;
      case 'roles':
        this.expression = true;
        this.isExit = true;
        this.isVisible = false;
        this.flag = 'role';
        this.modalTitle = '选择角色';
        this.selectCode('queryRole');
        this.transactionActionApiService.submitAction('queryRole');
        break;
      case 'users':
        this.expression = true;
        this.isExit = true;
        this.isVisible = false;
        this.flag = '';
        this.modalTitle = '选择员工';
        this.selectCode('queryUser');
        this.transactionActionApiService.submitAction('queryUser');
    }
  }

  selectRowsHandler($event){
    console.log($event)
    if($event.selectRows[0].org_name != undefined){
       if(this.Item == 'add'){
        this.text4 = [];
        for(var i=0;i<$event.selectRows.length;i++){
          this.text4.push($event.selectRows[i]);
        }
       }else{
        for(var i=0;i<$event.selectRows.length;i++){
          this.text4.push($event.selectRows[i]);
        }
       }
    }
      else if($event.selectRows[0].role_name != undefined){
        if(this.Item == 'add'){
          this.text3 = [];
        for(var i=0;i<$event.selectRows.length;i++){
          this.text3.push($event.selectRows[i]);
        }
        }else{
          for(var i=0;i<$event.selectRows.length;i++){
            this.text3.push($event.selectRows[i]);
          }
        }
      }else if($event.selectRows[0].user_name != undefined){
      if(this.Item == 'add'){
        console.log(this.Item)
        this.text2 = [];
      for(var i=0;i<$event.selectRows.length;i++){
        this.text2.push($event.selectRows[i]);
      }
      console.log(this.text2)
      }else{
        for(var i=0;i<$event.selectRows.length;i++){
          this.text2.push($event.selectRows[i]);
        }
      }
    }
  }
  deletItem(index,item){
    switch (item){
      case 'orgs':
        this.text4.splice(index,1);
        console.log(this.text4)
        break;
      case 'roles':
        this.text3.splice(index,1);
        break;
      case 'users':
        this.text2.splice(index,1)
    }
  }
  clearItem(item){
    switch (item){
      case 'orgs':
        this.text4 = [];
        break;
      case 'roles':
        this.text3 = [];
        break;
      case 'users':
        this.text2 = [];
        break;
    }
  }

  // 头部查询框改变
  selectChange($event){
    if($event == 'msg_info_status'){
      this.flags = false;
    }else if($event == 'msg_info_title'){
      this.flags = true
    }
    
  }
  /**
   * 新增修改对话框提交
   */
  handleOk(): void {
    this.isVisible = false;
    let obj4 = [];
    let obj3 = [];
    let obj2 = [];
    this.text4.forEach((item) => {
      obj4.push(item.org_code)
    })
    this.text3.forEach((item)=>{
      obj3.push(item.role_code)
    })
    this.text2.forEach((item)=>{
      obj2.push(item.user_code)
    })
    this.transactionActionData['saveOrUpdate'].request.requestdata.bdy.orgs = obj4;
    this.transactionActionData['saveOrUpdate'].request.requestdata.bdy.roles = obj3;
    this.transactionActionData['saveOrUpdate'].request.requestdata.bdy.users = obj2;
    this.transactionActionData['saveOrUpdate'].request.requestdata.bdy.msg_info_data = this.value;
    this.selectCode('saveOrUpdate');
    this.transactionActionApiService.submitAction('saveOrUpdate'); // 调用新增还是修改方法
    this.text4 = [];
    this.text3 = [];
    this.text2 = [];
    this.Item = '';
  }
  // 关闭应用交易
  handleCancel(): void {
    this.isVisible = false;
    this.Visible = false
  }
  change() {
    if (this.transactionActionData['saveOrUpdate'].request.requestdata.bdy.item.msg_info_rec_flag== 1) {
      this.expression = true
    } else {
      this.expression = false
    }
  }

  timeChange() {
    if (this.time2 < this.time) {
      this.time2 = '';
    }
  }
  ok() {
    this.isExit = false;
    this.isVisible = true;
    this.Item = '';
  }
  cancel() {
    this.isExit = false;
    this.isVisible = true;
  }
  // 点击行内方法
  rowActionsHandler($event) {
    switch ($event.key) {
      case 'eidt':
        this.Item = 'edit';
        this.text4 = [];
        this.text3 = [];
        this.text2 = [];
        this.isVisible = true;
        this.isUpdate = true;
        this.transactionActionData['queryDetail'].request.requestdata.bdy.msg_info_id = $event.item.msg_info_id;
        this.selectCode('queryDetail');
        this.transactionActionApiService.submitAction('queryDetail');
        this.transactionActionData['saveOrUpdate'].request.requestdata.bdy.item= { ...$event.item };
        break;
      case 'issue':
        if($event.item.msg_info_status == '0'){
          this.transactionActionData['updateStatus'].request.requestdata.bdy.item = {...$event.item};
          this.transactionActionData['updateStatus'].request.requestdata.bdy.item.msg_info_status = '1';
          this.transactionActionData['updateStatus'].request.requestdata.bdy.user_code = this.userCode;
          this.transactionActionApiService.submitAction('updateStatus');
        }else if($event.item.msg_info_status == '1'){
          this.transactionActionData['updateStatus'].request.requestdata.bdy.item = {...$event.item};
          this.transactionActionData['updateStatus'].request.requestdata.bdy.item.msg_info_status = '2';
          this.transactionActionData['updateStatus'].request.requestdata.bdy.user_code = this.userCode;
          this.transactionActionApiService.submitAction('updateStatus');
        }
        break;
      case 'del':
        this.transactionActionData['updateStatus'].request.requestdata.bdy.item = {...$event.item};
        this.transactionActionData['updateStatus'].request.requestdata.bdy.item.msg_info_status = '3';
        this.transactionActionData['updateStatus'].request.requestdata.bdy.user_code = this.userCode;
        this.transactionActionApiService.submitAction('updateStatus');
        break;
    }
  }
  // 消息内容查询
  rowActiveHandler($event) {
    console.log($event)
    this.Visible = true
    this.transactionActionData['queryDetail'].request.requestdata.bdy.msg_info_id = $event.msg_info_id;
    this.selectCode('queryDetail');
    this.transactionActionApiService.submitAction('queryDetail');
  }

  /**
   * 行为提交前钩子函数，一般在此处做表单校验
   */
  beforeSubmitCheck(actionCode: string): boolean {
    if (actionCode === 'saveOrUpdate') {
      return this.baseForm.valid();
    }
    return true;
  }
  // 筛选userCode
  selectCode(item){
    // debugger;
    console.log(item);
    this.transactionActionData[item].request.requestdata.bdy.user_code=this.userCode;
  }
}


// 注册交易
TransactionDefManager.registe({
  transCode: 'tx990606', // 交易代码
  transName: '消息通知', // 交易名称
  transActions: [
    {
      actionCode: 'query', // 
      actionReqHead: { svcCode: 'TX100004', funcCode: 'queryPubByCurrentUser' }, // 请求头参数
      actionReqData: { bdy: { page: '1', length: '10', user_code:'',pageSize:'10'} } // 请求体参数
    },
    {
      actionCode: 'queryDetail', // 
      actionReqHead: { svcCode: 'TX100004', funcCode: 'loadDetailById' }, // 请求头参数
      actionReqData: { bdy: { msg_info_id:''} } // 请求体参数
    },
    {
      actionCode: 'saveOrUpdate', // 新增、修改消息通知
      actionReqHead: { svcCode: 'TX100004', funcCode: 'saveOrUpdate' }, // 请求头参数
      actionReqData: {
        bdy:
        {
          item: { msg_info_title: '', msg_info_status: '', msg_info_type: '', msg_info_rec_flag: '' },
          msg_info_data: '',
          orgs: [],
          roles: [],
          users: [],
          user_code:''
        }
      } // 请求体参数
    },
    {
      actionCode: 'updateStatus', // 修改消息通知状态
      actionReqHead: { svcCode: 'TX100004', funcCode: 'updateStatus' }, // 请求头参数
      actionReqData: {
        bdy:
        {
          item: { msg_info_title: '', msg_info_id: '', user_code:'', msg_info_status: '', msg_info_type: '', msg_info_rec_flag: '', id: '', create_date: '' },
          user_code:''
        }
      } // 请求体参数
    },
    {
      actionCode: 'queryOrg', // 查询机构
      actionReqHead: { svcCode: 'TX001', funcCode: 'conditionQuery' }, // 请求头参数
      actionReqData: {
        bdy: { tablename: 'btf_org_info', page: '1', pagesize: '10',user_code:'' } // 请求体参数
      }
    },
    {
      actionCode: 'queryRole', // 查询角色
      actionReqHead: { svcCode: 'TX001', funcCode: 'conditionQuery' }, // 请求头参数
      actionReqData: {
        bdy: { tablename: 'btf_role_info', page: '1', pagesize: '10',user_code:'' } // 请求体参数
      }
    },
    {
      actionCode: 'queryUser', // 查询用户
      actionReqHead: { svcCode: 'TX001', funcCode: 'conditionQuery' }, // 请求头参数
      actionReqData: {
        bdy: { tablename: 'btf_user_info', page: '1', pagesize: '10',user_code:'' } // 请求体参数
      }
    },
  ],
  mainActionCode: CommonActionCodeContants['queryPubByCurrentUser'] // 主行为，可使用F5调用
});




