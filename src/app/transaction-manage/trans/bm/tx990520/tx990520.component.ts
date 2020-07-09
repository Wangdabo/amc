import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { SettingService } from '../../../../service/setting.service';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import '../../../../../../node_modules/echarts/extension/bmap/bmap.js';
import {BaseTransaction} from "../../base-transaction";
import {HttpClient} from "@angular/common/http";
import {TransCommonApiHelper} from "../../trans-common-api-helper";
import {HttpService} from "tms-platform";
import { GlobalService } from 'src/app/service/global.service';
const transCode = 'tx990520';
const transName = '工作站监控';
const exFuncCode = [ 'alertQuery', 'queryCode', 'updatePeer'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
declare let maptalks: any;

@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990520',
  templateUrl: './tx990520.component.html',
  styleUrls: ['./tx990520.component.css']
})
export class Tx990520Component extends BaseTransaction implements OnDestroy {
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>;
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{type: string, transCode: string, params: any}> = new EventEmitter();
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }> = new EventEmitter();
  constructor(public settingService: SettingService,
              private http: HttpClient,
              private httpService: HttpService,
              private global: GlobalService,

  ) {
    super(transCode);
  }
  isVisible: boolean = false; // 工作站列表弹窗
  modelTitle: string;
  errorinfo = false;
  pageSize = '1'; // 每页个数
  fixedPageSize = '1'; // 当前页数
  isLoading = false;
  declineTime: any; // 时间查询工作站信息
  workInfo = {};
  // 筛选数据信息
  selectedValue = {
    workstationCode: '', // 工作站代码
    workstationName: '', // 工作站名称
    channel_code: '', // 工作站类别
    orgCode: '' // 组织机构code
  };
  // 工作站类别
  workstationArray = [
    {key: '0', value: '柜员工作站'},
    {key: '1', value: '移动柜员工作站'},
    {key: '2', value: '超级柜台'},
  ];
  joinOps = [
    {
      // 关联表
      joinTable: 'btf_workstation',
      // 需要查询的关联表中的字段明
      queryJoinFields: [{fieldName: 'workstation_name', alias: 'workstation_name'}, {fieldName: 'channel_code', alias: 'channel_code'},{fieldName: 'org_code', alias: 'org_code'}],
      // 关联主表字段
      mainField: 'workstation_code',
      // 关联表字段
      joinField: 'workstation_code'
    }
    ]
  dataSet: any; // 错误数据
  totalCount: number; // 错误信息总数
  errordetails = false; // 错误总数
  errorJson: any; // 错误代码json
  map: any; // 地图
  topSelects = []; // 监控方案选择
  listHeader: any;
  dataList: any;
  page = 1; // 当前页数
  total: number; // 总页数
  caveatImg = './assets/newimage/workMagger/btn_wuyichang.png'; // 警告内容框--无内容
  caveatalertImg = './assets/newimage/workMagger/btn_youyichang.png'; // 警告内容框-- 有内容
  isquery = false; // 默认是false
  marketsArray = []; // 保存所有标注数组
  rowActions = [{ key: 'info', label: '详情'}];
  listHead = [ // 工作站头部hedaer
    {
      key: 'workstationCode', label: '工作站代码'
    }, {
      key: 'workstationName', label: '工作站名称'
    }, {
      key: 'orgCode', label: '机构代码'
    },  {
      key: 'channelCode', label: '渠道代码'
    }
  ];
  intervalTime: any; // 调用监控数据方法
  /* ----------------------------------------------------------------------list表单方法--------------------------------------------------- */

  selectRows($event) {
     
  }

  onEnterAfter(): void {
    this.isVisible = false;
    super.initBase(this.transactionContextChangeOb, this.submitEvent,this.sonRouteEvent);
    this.getCode();
  }


  listDataCallback(data: any): void {
  }

  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    ).resultdata;
    // 交易管理接值
    switch (tcFuncCode) {
      case 'alertQuery':  // 查询警告框
        this.listHeader = [
          {label: '告警状态', key: 'status', width: '100px', tag: true},
          {label: '工作站代码', key: 'workstation_code', width: '150px'},
          {label: '工作站名称', key: 'workstation_name', width: '200px'},
          {label: '告警信息', key: 'alert_message', width: '100px'},
          {label: '告警时间', key: 'alert_time', width: '200px'}
        ];
        if(result.bdy.data.length > 0) {
          result.bdy.data.forEach( (item) => {
            if(item['alert_status'] === '0') {
              item['status'] = '未读'
            }
            if(item['alert_status'] === '1') {
              item['status'] = '已读'
            }
          })
        }
        this.dataSet = result.bdy.data;
        this.totalCount = result.bdy.count; // 总是要自己算哦
        break;
      case 'queryCode':  // 查询警告框
        this.topSelects = result.bdy.data;
        let obj = this.topSelects[0].config_detail;
        this.intervalTime = this.toString(obj);// 调用字符串转对象方法
        this.init(); // 轮询调用查询方法
        this.initMap(); // 初始化地图
        this.declineTime = setInterval(() => {
          this.init()
        }, Number(this.intervalTime.refreshInterval) * 1000);
        break;
      case 'updatePeer':  // 查询警告框
        this.init(); // 轮询调用查询方法
        this.initList(); // 重新调用
        break;
    }
  }



  // 字符串转对象方法
  toString(str) {
      let objArray  = str.split(','); // 转成数组
      let obj = {}; // 接收对象的数据
      objArray.map(function(value) { // 分割成对象
          const str = value.split(':');
            if (str[0] === 'alarmTimeE' || str[0] === 'alarmTimeB') { // 因为是时间，被分割成四项了，所以单独处理
              obj[str[0]] = str[1] + ':' +  str[2] + ':' +  str[3]
            } else {
              obj[str[0]] = str[1]
            }
        });
       return obj;
  }
  // 获取code
  getCode() {
    TransCommonApiHelper.conditionQuery(this, 'queryCode', {
      tablename: 'btf_trans_monitor_config',
      page: '1',
      pagesize: '999'
    });
  }


  // 初始化数据
  init() {
    this.httpService.get( this.global.ipserver + '/workstation/instances/online')
      .subscribe(res => {
          this.workInfo = res; // 更改数据
          this.marketsArray.forEach((item) => { // 循环标注数组，移除之前的标注，重新生成标注
            item.remove(); // marke 提供的清除标注方法
          });
          this.legend(this);
        }
      );
  }


  initMap() {
    // 初始化地图
    this.map = new maptalks.Map('map', {
      center: [105.08052356963802, 36.04231948670001],
      zoom: 5,
      minZoom:1,
      maxZoom:19,
      spatialReference:{
        projection : 'baidu'
      },
      baseLayer: new maptalks.TileLayer('base', {
        'urlTemplate' : 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1',
        'subdomains'  : [0,1,2,3,4,5,6,7,8,9],
        'attribution' :  '&copy; <a target="_blank" href="http://map.baidu.com">Baidu</a>'
      })
    });
    new maptalks.VectorLayer('vector').addTo(this.map);

  }
  // 初始化地图标注
  legend(that){
    // 存在，才去加图注，否则不加
    if(this.workInfo['workstations']) {
      console.log(this.workInfo['workstations'])
      // 循环数据处理
      let ipadArrayy = this.workInfo['workstations'].filter(item => item.type == "Pad");
      if(ipadArrayy.length > 0) {
        ipadArrayy.forEach( (value) => {
          let marker = new maptalks.ui.UIMarker(value.location, {
            'draggable'     : true,
            'single'        : false,
            'content'       : '<div  style="cursor: pointer">' +
            '<img style="width: 20px; position: relativel; color: blue" src="./assets/map/mapred.png" alt="">' +
            '<div style="position:absolute; z-index: -1;  top:-37px; left: -10px; "><img style="width: 40px; height: 40px;" src="./assets/newimage/workMagger/icon_pad.png" alt=""></div>' +
            '</div>'
          });
          marker.addTo(that.map).show();
          marker.on('click', function (param) {
            that.modelTitle = '移动柜面详情';
            that.isVisible = true;
            that.initwork(value); // 调用数据
          });
          this.marketsArray.push(marker); // 保存所有的marker标注对象,用来清除标注，否则当新设备上线的时候，会不能实时刷新
        });
      }

      let atmArray = this.workInfo['workstations'].filter(item => item.type == "Itm");
      let cpArray = this.workInfo['workstations'].filter(item => item.type == 'SuperCounter');
      if(cpArray.length > 0) {
        cpArray.forEach((value) => {
          let marker = new maptalks.ui.UIMarker(value.location, {
            'draggable'     : true,
            'single'        : false,
            'content'       : '<div  style="cursor: pointer"  (click)="ceshi()">' +
            '<img style="width: 20px; position: relativel; color: blue" src="./assets/map/mapblue.png" alt="">' +
            '<div style="position:absolute; z-index: -1;  top:-37px; left: -10px; "><img style="width: 40px; height: 40px;" src="./assets/newimage/workMagger/icon_computer.png" alt=""></div>' +
            '</div>'
          });
          marker.addTo(that.map).show();
          marker.on('click', function (param) {
            that.modelTitle = '电脑信息详情';
            that.isVisible = true;
            that.initwork(value); // 调用数据
            this.marketsArray.push(marker); // 保存所有的marker标注对象,用来清除标注，否则当新设备上线的时候，会不能实时刷新
          });
        })
      }
      if(atmArray.length > 0) {
        atmArray.forEach(function (value) {
          let marker = new maptalks.ui.UIMarker(value.location, {
            'draggable'     : true,
            'single'        : false,
            'content'       : '<div  style="cursor: pointer">' +
            '<img style="width: 20px; position: relativel; color: blue" src="./assets/map/mapgreen.png" alt="">' +
            '<div style="position:absolute; z-index: -1;  top:-37px; left: -10px; "><img style="width: 40px; height: 40px;" src="./assets/newimage/workMagger/icon_phone.png" alt=""></div>' +
            '</div>'
          });
          marker.addTo(that.map).show();
          marker.on('click', function (param) {
            that.modelTitle = 'Itm详情';
            that.isVisible = true;
            that.initwork(value); // 调用数据
            this.marketsArray.push(marker); // 保存所有的marker标注对象,用来清除标注，否则当新设备上线的时候，会不能实时刷新
          });
        });
      }
    }
  }


  // 调用警告框列表方法
  initList() {
    TransCommonApiHelper.conditionQuery(this, 'alertQuery',
      {
             page: this.fixedPageSize,
             pagesize: '10',
             tablename: 'btf_workstation_alert',
             joinOps: this.joinOps})
  }


  // 查询数据---打开弹窗
  query(item) {
    this.isquery = true; // 是查询接口
    this.modelTitle = '工作站列表';
    this.isVisible = true;
    this.isLoading = true;
    item['size'] = 10;
    item['current'] = this.pageSize;
    item['search'] = true; // true  不点击图片
    // 删除空对象
    for(var key in item) {
      if(item[key] === '') {
        delete item[key];
      }
    }
    this.http.get( this.global.ipserver + '/workstation/workstations', {params: item})
      .subscribe(res => {
          console.log(res);
          this.isLoading = false;
          this.dataList = res['records'];
          this.total = res['current'];
          this.pageSize = res['pages'];
        }
      );
  }


  // 查询工作站接口方法
  initwork(item) {
    this.isquery = false; // 不是查询接口
    this.isLoading = true;
    item['size'] = 10;
    item['current'] = this.pageSize;
    item['search'] = false; // true  不点击图片
    item['channelCode'] = item.type; // 渠道id
    item['workstationCode'] = item.id; // 类型
    let json = item;
    this.http.get( this.global.ipserver + '/workstation/workstations', {params: json})
      .subscribe(res => {
          this.isLoading = false;
          this.dataList = res['records'];
          this.total = res['current'];
          this.pageSize = res['pages'];
        }
      );
  }


  // 错误信息详情--今晚改成弹框，左侧改成list 列表。
  errorClick() {
      this.errorinfo = true;
      this.initList();
  }


  // 告警列表详情
  rowActiveHandler($event) {
    if($event) {
      if($event['alert_status'] == '0') {
        let submitData = {
          id: $event.id,
          alert_status: '1'
        };
        TransCommonApiHelper.update(this, "updatePeer", {
          tablename: "btf_workstation_alert",
          data: submitData
        });
      }
      this.errorJson = $event;
      this.errordetails = true;
    }
  }

  // 告警翻页详情
  pageHandler($event) {
    this.fixedPageSize = $event['pageIndex'];
    this.initList()
  }


  skipTx990521(workstationCode) {
    // super.skipSonRoute('tx990521', { workstationCode: workstationCode });
    super.skipSonRoute('tx990525', { workstationCode: workstationCode });
  }

  rowActionsHandler($event) {
    this.isVisible = false; // 关闭弹框
    this.skipTx990521($event.item.workstationCode);
  }

  // 列表详情翻页
  pageChange($event) {

      this.pageSize = $event.pageIndex.toString();
  }



  // 销毁
  ngOnDestroy() {
    clearInterval(this.declineTime);
  }
}
