import { Component, OnInit ,ViewChild } from '@angular/core';
import {
  BaseTransaction, CommonActionCodeContants, ShareParamsService, TransactionActionApiService, TransactionActionData,
  TransactionActionDefManager,
  TransactionDefManager
} from "tms-platform";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn.js';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {FormComponent} from "tms-platform-component";

const model = {
  editorData: '<p>豪大大</p>'
};
let url:any;
@Component({
  selector: 'app-tx990601',
  templateUrl: './tx990601.component.html',
  styleUrls: ['./tx990601.component.css']
})
export class Tx990601Component extends BaseTransaction implements OnInit {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  constructor( private http:HttpClient,
               private shareParamsService: ShareParamsService,
               public transactionActionApiService: TransactionActionApiService) {
    super(shareParamsService);
  }
  public Editor = ClassicEditor;
  public model = model;
  // 定义接收返回值
  public Response:any;
  public isDisabled:Boolean = false;

  // 配置语言
  // ClassicEditor:plugins:[Alignment],
  public config = {
    language: 'zh-cn',
    toolbar:
      ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', "imageUpload"],
  };
  // 激活自定义上传适配器
  onReady(eventData) {
    const that = this;
    eventData.plugins.get('FileRepository').createUploadAdapter = function (loader) {
      return new  MyUploadAdapter(loader);
    };

  }

  // table的一些相关操作
  data = []; // 列表数据
  // Time:any = new Date().toLocaleDateString().replace(/\//g, "-") + " " + new Date().toTimeString().substr(0, 8);
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
  queryHeader = [
    {label:'标签',value:'tags',type:'select',filedType:"string",
      select:[
              {value: 'account', name: '账户类'},
              {value: 'FAQ', name: '常见问题'},
              {value: 'trade', name: '交易操作'},
              { value: 'news', name: '新闻类'}
            ]
    },
    {label:'作者',value:'author',type:'input',filedType:"string"},
    {label:'标题',value:'title',type:'input',filedType:"string"}
  ];
  optionArray = [
    {name: '账户类', value: 'account'},
    {name: '常见问题', value: 'FAQ'},
    {name: '交易操作', value: 'trade'},
    {name: '新闻类', value: 'news'}
  ];
  arraysOption = [
    {value: 0, name: '通用'},
    {value: 1, name: '操作'},
    {value: 2, name: '系统'}
  ];

  listHeader = [
    { key:'tags', label:'标签', width: '10', dictSelect:[
        {name: '账户类', value: 'account'},
        {name: '常见问题', value: 'FAQ'},
        {name: '交易操作', value: 'trade'},
        {name: '新闻类', value: 'news'}
      ] },
    { key:'author',  label:'作者' },
    { key:'title',  label:'标题' },
    { key:'pv',  label:'阅读量' }
  ];


  //获取查询数据
  getQueryData($event){
    console.log($event)
    console.log(this.transactionActionData[CommonActionCodeContants.QUERY].request.requestdata.bdy)
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
    this.transactionActionApiService.submitAction("common_query");
    model.editorData = this.transactionActionData[CommonActionCodeContants.INSERT_OR_UPDATE].request.requestdata.bdy.data.know_text
    console.log(this.transactionActionData[CommonActionCodeContants.INSERT_OR_UPDATE].request.requestdata.bdy.data.know_text)
  }

  afterSubmit(actionCode: string) { // 钩子，拿到响应，如果不需要在ts里处理，可以直接在html中 双向绑定使用 transactionActionData
    console.log('afterSubmit 触发 actionCode = ' +  actionCode);
    console.log(this.transactionActionData)
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
        model.editorData = ''
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
    console.log(model.editorData.replace(/\<img>/g,'<img src="'+url+'"/>'))
    model.editorData = model.editorData.replace(/\<img>/g,'<img src="'+url+'"/>')
    // this.model.editorData.toString().replace(/\<img>//g,'<img src="'+response.url+'" />')
    this.transactionActionData[CommonActionCodeContants.INSERT_OR_UPDATE].request.requestdata.bdy.data.know_text = model.editorData;
    // this.transactionActionData[CommonActionCodeContants.INSERT_OR_UPDATE].request.requestdata.bdy.data.pv = 0;
    this.transactionActionApiService.submitAction(CommonActionCodeContants.INSERT_OR_UPDATE); // 调用新增还是修改方法
    this.isVisible = false;
  }

  // 点击行内方法
  rowActionsHandler($event) {
    switch ($event.key) {
      case 'eidt':
        console.log($event.item)
        model.editorData = $event.item.know_text
        // this.Time1 = new Date().toLocaleDateString().replace(/\//g, "-") + " " + new Date().toTimeString().substr(0, 8);
        this.isVisible = true;
        this.isUpdate = true;
        console.log(this.transactionActionData[CommonActionCodeContants.INSERT_OR_UPDATE].request.requestdata.bdy.data.update_time)
        // this.transactionActionData[CommonActionCodeContants.INSERT_OR_UPDATE].request.requestdata.bdy.data.is_delete = 'y';
        this.transactionActionData[CommonActionCodeContants.INSERT_OR_UPDATE].request.requestdata.bdy.data = {...$event.item};
        delete this.transactionActionData[CommonActionCodeContants.INSERT_OR_UPDATE].request.requestdata.bdy.data.update_time;
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
  transCode: 'tx990601', // 交易代码
  transName: '知识库', // 交易名称
  transActions: TransactionActionDefManager.createCrudActionDef({svcCode: 'TX001', tableName: 'ctf_knowledge_rep'}), // 自动创建增删该查交易
  mainActionCode: CommonActionCodeContants.QUERY // 主行为，可使用F5调用
});


class MyUploadAdapter{
  private xhr;
  private loader;
  public model = model;
  public url = url;
  constructor( loader) {
      this.loader = loader;
  }
  upload() {
      return this.loader.file
          .then( file => new Promise( ( resolve, reject ) => {
              this._initRequest();
              this._initListeners( resolve, reject, file );
              this._sendRequest( file );
          } ) );
  }
  abort() {
      if ( this.xhr ) {
          this.xhr.abort();
      }
  }
  _initRequest() {
      const xhr = this.xhr = new XMLHttpRequest();
      // xhr.open( 'POST', 'http://222.73.218.43:28888/api/content/file/img/upload', true);
      xhr.open( 'POST', 'https://api.brons.top/content/file/img/upload', true);
  }
  _initListeners( resolve, reject, file) {
      const xhr = this.xhr;
      const loader = this.loader;
      const genericErrorText = `Couldn't upload file: ${ file.name }.`;
      xhr.addEventListener( 'error', () => reject( genericErrorText ) );
      xhr.addEventListener( 'abort', () => reject() );
      xhr.addEventListener( 'load', () => {
          const response = xhr.response;
          console.log(response);
          url = JSON.parse(response).url;
          console.log(url);
          console.log(model.editorData);
          if ( !response || response.error ) {
              return reject( response && response.error ? response.error.message : genericErrorText );
          }
          console.log(JSON.parse(response).url);
          resolve({
              default: response.url
          } );
      } );
      if ( xhr.upload ) {
          xhr.upload.addEventListener( 'progress', evt => {
              if ( evt.lengthComputable ) {
                  loader.uploadTotal = evt.total;
                  loader.uploaded = evt.loaded;
              }
          } );
      }
  }
  _sendRequest( file ) {
    const data = new FormData();
    data.append('resources', file);
    this.xhr.send(data);
  }
}





