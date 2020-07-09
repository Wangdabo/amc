import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { IfearmService } from '../../../../service/ifearm.service';
import {Tx990522Component} from '../tx990522/tx990522.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BsaApi, HttpService, ServiceRequest, ServiceTypeEnum} from "tms-platform";
import {DatePipe} from "@angular/common";
import { webSocket } from 'rxjs/webSocket';
import { GlobalService } from 'src/app/service/global.service';
declare const BMap: any;
const transCode = 'tx990525';
const transName = '工作站监控详情';
const tableName = 'BTF_TRANS_JNL';
const exFuncCode = ['queryCode'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [],
  tableName: tableName
};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options,
  subTransCodes: ['tx990522']
})
@Component({
  selector: 'app-tx990525',
  templateUrl: './tx990525.component.html',
  styleUrls: ['./tx990525.component.css']
})
export class Tx990525Component extends CrudTransaction  implements OnDestroy{
  ws: WebSocket; // 定义websocket
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @ViewChild('tx990522', {static: true})
  tx990522: Tx990522Component;
  @Input('params') params: any;
  @Input('transactionContextChangeOb')
  transactionContextChangeOb: Observable<{ tcFuncCode: string, transactionContext: TransactionContext }>;
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{ type: string, transCode: string, params: any }> = new EventEmitter();
  @Output('submitEvent')
  submitEvent: EventEmitter<{ svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }> = new EventEmitter();
  declineTime: any; // 轮询查询外设信息
  workInfoTime: any; // 轮询查询工作站信息
  // 组件字段
  // 样式
  gridStyle = {
    width: '25%',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '18px'
  };
  gridShowStyle = {
    width: '25%',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    background: '#108ee9',
    color: '#fff'
  };
  topData = [
    { text: '实时信息监控', icon: 'api', index: 1 , id: 'peripheral', src:'./assets/newimage/Insight/btn_selected.png'},
    { text: '交易', icon: 'font-size', index: 2, id: 'transaction',  src:'./assets/newimage/Insight/btn_normal.png'},
    { text: '运行事件', icon: 'ordered-list', index: 3 , id: 'runningLog', src:'./assets/newimage/Insight/btn_normal.png'},
    { text: '设备日志', icon: 'file-text', index: 4 , id: 'equipmentDay', src:'./assets/newimage/Insight/btn_normal.png'}
  ];
  // 运行日志模拟数据
  runninglog = [
      {'instance':'50:01:D9:D1:07:6D',
        'version':0,
        'timestamp':'2019-08-12T01:39:42.466Z',
        'type':'REGISTERED',
       },
      {'instance':'50:01:D9:D1:07:6D','version':1,'timestamp':'2019-08-12T01:52:55.290Z','type':'STATUS_CHANGED',
        'statusInfo':{'status':'OFFLINE','details':{}}
      }
  ];
  workDetails = {
    workstationCode: '',
    versionNo : "", // 序号
    workstationName: "", // 工作站名称
    orgCode: "", // 组织机构代码
    channelCode: "", // 渠道代码
    workstationKind: "", // 工作站类别
    masterFlag: "", // 主从站标志
    workstationIp: "", // 工作站IP
    msgpushPort: "", // 地址端口
    workstationStatus: '', // 工作站状态
    workstationSwitch: '', // 工作站开关
    setDate: '', // 设置时间
    shutoutDate: '', // 启营时间
    suitCode: ' ', // 套装代码
    lastDate: '' // 最后登录时间
  }; // 工作站详情信息
  optionsBank: any; // 内存饼图数据
  optionsAssets: any; // 交易迁移折线图数据
  showId = 'peripheral'; // 默认是实时监控信息
  real = {
    maxMemory: '',
    freeMemory: '',
    totalMemory: '',
    time: ''
  }; // 外设请求数据保存
  realStauts: boolean;
  stationCode: string; // 拿到传递过来的工作组code 来调用接口
  peripheral: any;
  resultdata: any; // 下載文件列表
  resultStatus: any; // 下載文件列表
  transListBar: any;
  ponit: any; // 百度地图经纬度
  up: boolean; // 是否连接
  constructor(public settingService: SettingService,
              private ifearm: IfearmService,
              private notification: NzNotificationService, private modelService: NzModalService,
              private http: HttpClient,
              private httpService:HttpService,
              private datePipe: DatePipe,
              private bsaApi: BsaApi,
              private message: NzMessageService,
              private global: GlobalService

  ) {
    super(transCode);
  }
  onEnterAfter(): void {
    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb,
      submitEvent: this.submitEvent,
      baseForm: this.baseForm,
      notification: this.notification, modelService: this.modelService, sonRouteEvent: this.sonRouteEvent
    });
    // this.details(); // 调用查询接口
    this.up = false;
    this.stationCode = this.params['workstationCode'];
    this.tx990522.onEnterAfter(this.stationCode); // 调用子组件交易管理
    this.initworkInfo(); // 调用工作站详情接口
    this.queryFile(); // 调用查询日志文件接口
    this.queryTranList(); // 接口交易六个月


    this.workInfoTime = setInterval(() => { // 轮询调用工作站详情接口
      this.initworkInfo(); // 调用工作站详情接口
    }, 20 * 1000);

    
    // 链接webstock
    this.connectWs();

  }

  listDataCallback(data: any): void {

  }
  onCrudTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    );
    // 调用子组件必须调用这个
    const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);
    if (parse.name === Tx990522Component.name) {
      this.tx990522.onTransactionContextChange(parse.funcCode, transactionContext, 'tx990522');
      return;
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

  // 查询工作站详情
  initworkInfo() {
    this.httpService.get( this.global.ipserver + '/workstation/workstations/' + this.stationCode)
      .subscribe(res => {
         this.workDetails = res['workstation']; // 还有一个instance字段，代表工作站的信息 ----当前的状态注册信息 还没想好放在那里，先预留记录下, 样式改版之后，用图形展示
        // 判断远程操作的显示内容
          if(this.workDetails.workstationStatus === '0') { // 代表此时状态是在线，那就改成暂停
            this.offlineApp = [
              {name: '停止服务', type: 'stopserve', src: './assets/newimage/workMagger/stopapp.png'},
            ];
            this.deviceController = [
              {name: '获取日志', type: 'setlog', src: './assets/newimage/workMagger/setlog.png'},
              {name: '智能体检', type: 'examination', src: './assets/newimage/workMagger/examination.png'},
              {name: '关闭应用', type: 'closeApp', src: './assets/newimage/workMagger/closeApp.png'},
              {name: '停止服务', type: 'stopserve', src: './assets/newimage/workMagger/stopapp.png'}
            ];
          } else {
            this.offlineApp = [
              {name: '恢复服务', type: 'restoreserve', src: './assets/newimage/workMagger/restoreserve.png'},
            ];
            this.deviceController = [
              {name: '获取日志', type: 'setlog', src: './assets/newimage/workMagger/setlog.png'},
              {name: '智能体检', type: 'examination', src: './assets/newimage/workMagger/examination.png'},
              {name: '关闭应用', type: 'closeApp', src: './assets/newimage/workMagger/closeApp.png'},
              {name: '恢复服务', type: 'restoreserve', src: './assets/newimage/workMagger/restoreserve.png'}
            ];
          }

          this.runninglog = res['event'].reverse();
          if(res['instance']['statusInfo'].status !== 'OFFLINE' ) { // 设备在线，才去调用
            this.up = true;
          } else {
            this.up = false;
          }
        }
      );
  }



  // webstock 拿到外设信息
  initreal(res) {
    if(res['status'] === 'success') { // 有设备链接才展示
      this.real = res['info'];
      this.real['use'] = Number(this.real['totalMemory']) - Number(this.real['freeMemory']);
      if(!this.ponit) { // 如果不存在，代表第一次，那就去赋值
        this.ponit = this.real['location'];
        this.initMap(this.ponit); // 调用百度地图API接口
      } else {
          if(this.ponit !== this.real['location']) { // 如果不相同，那就代表发生了变化，去重新调用
            this.ponit = this.real['location'];
            this.initMap(this.ponit); // 调用百度地图API接口
          }
      }
      let perlist = [];
      let objS = JSON.parse(this.real['deviceInfo']);
      for(let i in objS){ //json循环
        perlist.push(objS[i])
      }
      perlist.forEach((item) => {
        if(item.info['retCode'] == '000000') {
          item.status = '已连接'
        } else {
          item.status = '未连接'
        }
      });
      this.peripheral = perlist; // 数组赋值
      if(this.peripheral.length > 0) {
        this.peripheral.forEach((item) => {
             if(item.name === '身份证') {
                item.src = './assets/newimage/workMagger/icon_shenfenzheng@2x.png'
             }
          if(item.name === '密码键盘') {
            item.src = './assets/newimage/workMagger/icon_jianpanmima@2x.png'
          }
          if(item.name === '指纹仪') {
            item.src = './assets/newimage/workMagger/icon_zhiwenyi@2x.png'
          }
          if(item.name === '接触式IC卡') {
            item.src = './assets/newimage/workMagger/icon_jiechushiicka@2x.png'
          }
          if(item.name === '非接触式IC卡') {
            item.src = './assets/newimage/workMagger/icon_feijiechushiicka@2x.png'
          }
          if(item.name === '磁条卡') {
            item.src = './assets/newimage/workMagger/icon_citiaoka@2x.png'
          }
          if(item.name === '手写签名') {
            item.src = './assets/newimage/workMagger/icon_shouxieqianming@2x.png'
          }
        })
      }
      this.initPerMap(); // 重新调用内存图接口
      if(this.up) { // 在线，未得数据，才显示在线
        this.realStauts = false; // 在线并且有数据，显示完整内容
      }
    } else {
      this.realStauts = true; //  等待设备连接
    }
  }


  onAddActionBefore(): void {
  }
  // 销毁
  ngOnDestroy() {
    clearInterval(this.declineTime);
    clearInterval(this.workInfoTime); // 清空轮询
  }

  // 调用子组件必须调用这个
  submitTx990522EventHandler(event: {svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}) {
    super.submit(event.svcCode, TransactionContextHelper.formatFuncCode('tx990522', event.tcFuncCode), event.funcCode, event.bdy);
  }


  // 初始化外设内存饼图方法
  initPerMap() {
    this.optionsBank = {
      title: {
        x: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: '10',
        top: '-5',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#fff'
        },
        data: ['空闲'+ Number(this.real['freeMemory']).toFixed(2) + 'M' , '已用' + this.real['use'].toFixed(2) + 'M' ]
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          data: [
            { value: this.real['freeMemory'], name: '空闲'+ Number(this.real['freeMemory']).toFixed(2) + 'M'},
            { value: this.real['use'], name: '已用' + this.real['use'].toFixed(2) + 'M'  }
          ],
          label: {
            fontSize: 16,
            show: true
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  // 初始化交易图方法
  initTransMap() {
    let data = [];
    let datelist = [];
    // 数据处理----成echarts 需要在格式
    this.transListBar.forEach((item) => {
      data.push(item['count'])
      datelist.push(item['month'])
    });
    this.optionsAssets = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'category',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: datelist,
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      series: [{
        data: data,
        type: 'line',
        smooth: true
      }]
    };
  }

  // 卡片点击
  cardClick(item) {
      this.showId = item.id;

    this.topData.forEach((i) => {
      if(i.index === item.index) {
        i.src  = './assets/newimage/Insight/btn_selected.png'
      } else {
        i.src  = './assets/newimage/Insight/btn_normal.png'
      }
    });

    // 原逻辑判断
    if(item.id === 'peripheral') {
      this.initPerMap(); // 调用初始化图方法
    } else if(item.id === 'transaction') {
      this.initTransMap();
    } else if(item.id === 'equipmentDay') {
      this.queryFile();
    }
  }

  // 查询六个月的交易迁移数据
  queryTranList() {
    this.httpService.get( this.global.ipserver + '/workstation/workstations/' + this.stationCode + '/trans?monthSum=6')
      .subscribe(res => {
            this.transListBar = res;
        }
      );
  }


  // 调用查询日志文件接口
  queryFile() {
    let obj = { URL: this.stationCode};
    let http = this.global.ipserver + '/content/file/queryByURL' + '?URL=' + this.stationCode;
    this.httpService.post(http, JSON.stringify(obj))
      .subscribe(res => {
        if(res['resultdata'].length > 0) {
          console.log(res)
          this.resultStatus = true; // 有文件
          this.resultdata  = res['resultdata'];
          this.resultdata.forEach((item) => {
            item['size'] = this.getfilesize(item['file_size'])
          });
        } else {
          this.resultStatus = false; // 无文件
        }
        }
      )
  }


  // 文件格式转换方法 B K M G T
  getfilesize(size) {
    if (!size)
      return "";
    var num = 1024.00; //byte
    if (size < num)
      return size + "B";
    if (size < Math.pow(num, 2))
      return (size / num).toFixed(2) + "K"; //kb
    if (size < Math.pow(num, 3))
      return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
    if (size < Math.pow(num, 4))
      return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
    return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
  }





  // 生成百度地图
  initMap(item) {
    if(item) { // 存在，代表有数据，进行正确定位
      const map = new BMap.Map('map'); //  创建地图实例
      const point = new BMap.Point(Number(item.split(',')[0]), Number(item.split(',')[1]));  // 到时候使用后台返回的经纬度，这里模拟数据
      map.centerAndZoom(point, 14);
      // 添加自定义覆盖物
      var marker = new BMap.Marker(point);        // 创建标注
      map.addOverlay(marker);                     // 将标注添加到地图中
    } else {
      const map = new BMap.Map('map'); //  创建地图实例
      const point = new BMap.Point(121.480773, 31.236303);  // 到时候使用后台返回的经纬度，这里模拟数据
      map.centerAndZoom(point, 14);
      // 添加自定义覆盖物
      var marker = new BMap.Marker(point);        // 创建标注
      map.addOverlay(marker);                     // 将标注添加到地图中
    }

  }



  // 文件下载
    down(item) {
      let filePath = encodeURI(item['file_path']);
      let format  = item['file_path'].substring(item['file_path'].indexOf('.') +1, item['file_path'].length); // 获取需要转换的格式 log png
      let http =this.global.ipserver + '/content/file/download?fileName=' + filePath;
      this.http.post(http, '', {responseType: 'arraybuffer'})
        .subscribe(res => {
          const link = document.createElement('a');
          // 转换成blob格式，指定格式
          const blob = new Blob([res], {type: 'application/' + format});
          link.setAttribute('href', window.URL.createObjectURL(blob));
          link.setAttribute('download', item['file_name']);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    }




    /*新增在线设备处理功能*/
    // 模拟数据，要根据春海给的服务当前状态标识来判断，是停止服务还是恢复服务
  deviceController = [];
  meType = '';
  loginDetail = [];
  newroultdata = [];
  /* 智能体检逻辑代码*/
  intelligentMedical = false; // 智能体检弹框
  panels = [
    {
      active: false,
      loading: true,
      name: '网络连接',
      text: '检查完毕...',
      color: 'grey',
      data: [],
      icon: 'wifi',
      customStyle: {
        'border-radius': '4px',
        'border': '0px'
      }
    },
    {
      active: false,
      text: '检查完毕...',
      loading: true,
      icon: 'cloud',
      color: 'grey',
      data: [],
      name: '服务检查',
      customStyle: {
        'border-radius': '4px',
        'border': '0px'
      }
    },
    {
      text: '检查完毕...',
      active: false,
      color: 'grey',
      loading: false,
      data: [],
      icon: 'api',
      name: '外设检查',
      customStyle: {
        'border-radius': '4px',
        'border': '0px'
      }
    },
    {
      active: false,
      color: 'grey',
      loading: false,
      text: '检查完毕...',
      icon: 'delete',
      data: [],
      name: '缓存垃圾',
      customStyle: {
        'border-radius': '4px',
        'border': '0px'
      }
    },

    {
      active: false,
      loading: true,
      color: 'grey',
      text: '检查完毕...',
      icon: 'reload',
      data: [],
      name: '版本检查',
      customStyle: {
        'border-radius': '4px',
        'border': '0px'
      }
    },

    {
      active: false,
      loading: true,
      color: 'grey',
      text: '检查完毕...',
      icon: 'snippets',
      data: [],
      name: '运行日志',
      customStyle: {
        'border-radius': '4px',
        'border': '0px'
      }
    }
  ];

  lengthQuery(data) {
    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  // websocket对接
  connectWs() {
    if (this.ws != null) {
      this.ws.close()
    }
    this.ws = new WebSocket('wss://api.brons.top/workstation/instances/ws/99');
    let that = this;

    // socket 开启后执行，可以向后端传递信息
    this.ws.onopen = function (event) {
      console.log('webstock 连接成功')
      that.connect();
    };

   // socket 获取后端传递到前端的信息
    this.ws.onmessage = function (event) {
      switch (that.meType) {
        case 'getLogs':
          console.log(JSON.parse(event.data).data);
            that.newroultdata = JSON.parse(JSON.parse(event.data).data);
          break;
        case 'connect':
            // 说明已链接
            console.log(JSON.parse(event.data))
            if (JSON.parse(event.data).data.indexOf('设备已连接') != -1 || JSON.parse(event.data).data.indexOf('对应设备在线') != -1) { // 说明已链接
                  that.realStauts = false;
                  var myDate = new Date();
                  that.getAppinfo(); // 调用外设信息
            } else { // 等待设备链接
              that.realStauts = true;
              var myDate = new Date();
            }
        break;
        case 'getAppinfo':
            const webObj = JSON.parse(event.data);
            that.initreal(JSON.parse(webObj.data));
        break;
        case 'logDetail': // 日志详情
        console.log(JSON.parse(event.data))
          if(that.loginDetail.length < 150) {
            that.loginDetail.push(JSON.parse(event.data).data);
          }
          break;
        case 'appCheck': // 智能体检
        console.log(JSON.parse(event.data))
          let checkjson = JSON.parse(JSON.parse(event.data).data);
          // 绑定网络连接
          if(checkjson.net_check === '0') {
            that.panels[0]['color'] = '#1890ff';
            that.panels[0]['text'] = '连接正常';
          }
          // 绑定服务信息
          if(checkjson.service_check === '0') {
            that.panels[1]['color'] = '#1890ff';
            that.panels[1]['text'] = '服务正常';
          }
          // 绑定设备信息
          let objString = JSON.parse(checkjson['device_check']);
          let flage = true;
          that.panels[2]['data'] = [];
          objString['deviceInfo'] = JSON.parse(objString['deviceInfo']);
          for (const key in objString['deviceInfo']) {
            if (objString['deviceInfo'].hasOwnProperty(key)) {
              const element = objString['deviceInfo'][key];
              that.panels[2]['data'].push(element);
            }
          }
          for (let index = 0; index < that.panels[2]['data'].length; index++) {
            if (that.panels[2]['data'][index]['info']['retCode'] !== '000000') {
              flage = false;
              break;
            }
          }
          that.panels[2].active = that.lengthQuery(that.panels[2]['data']);
          setTimeout(() => {
            that.panels[2]['loading'] = false;
            if (flage) {
              that.panels[2]['text'] = '全部正常';
              that.panels[2]['color'] = '#1890ff';
            } else {
              that.panels[2]['text'] = '部分异常';
              that.panels[2]['color'] = '#faad14';
            }
          });

          // 绑定缓存查询
          that.panels[3]['color'] = '#faad14';
          that.panels[3]['text'] = '存在缓存';
          that.panels[3]['data'] = [
            { name: '检测到存在' + checkjson.cache_query + '的缓存'}
          ];
          that.panels[3].active = that.lengthQuery(that.panels[3]['data']);

          // 插件更新查询
          const objdata = checkjson.version_check;
          for (let index = 0; index < objdata.length; index++) {
            objdata[index] = JSON.parse(objdata[index]);
          }

          let flages = false;
          for (let index = 0; index < objdata.length; index++) {
            if (objdata[index]['isUpdate']) {
              flages = true;
              break;
            }
          }
          setTimeout(() => {
            that.panels[4]['data'] = objdata;
            that.panels[4]['text'] = flages ? '检测到平台插件需要更新' : '暂无更新';
            that.panels[4]['color'] = flages ? '#faad14' : '#1890ff';
            that.panels[4].active = true;
          }, 1000);
          console.log(objdata)
          // 绑定运行日志
          let checkobj = JSON.parse(checkjson.error_log_check);
          that.panels[5]['color'] = '#faad14';
          that.panels[5]['text'] = '发现错误日志';
          that.panels[5]['data'] = checkobj['error_list'].slice(0, 3);
          that.panels[5].active = that.lengthQuery(that.panels[4]['data']);

          break;
          case 'stopApp': // 关闭应用
          console.log(JSON.parse(event.data))
            that.message.create('success', `应用关闭成功`);
          break;
      }
    };
   // socket error信息
    this.ws.onerror = function (event) {
      console.log('socket error');
    };
     //socket 关闭后执行
    this.ws.onclose = function (event) {
      console.log('socket close');
    }
  }


    // 发送消息通知
 sendMessages(messages:any){
      console.log(messages);
      if (this.ws){
        if (this.ws.readyState === 1){
          this.ws.send(JSON.stringify(messages));
        }else {
          console.log(this.ws.readyState);
        }
      }else {
        setTimeout(()=>{
          this.ws.send(messages);
        },1000);
      }
      
    }

  // 点击进行操作
  appsessting(item) {
    switch (item.type) {
      case 'setlog':
        this.isVisible = true; // 打开获取日志界面
        this.setapplog(); // 调用获取应用日志方法
        break;
      case 'examination':
        this.appCheck(); // 调用应用智能体检方法
        this.intelligentMedical = true; // 打开智能体检弹框
        break;
      case  'closeApp':
        this.closeApp(); // 调用关闭应用方法
        break;
      case  'stopserve': // 调用暂停服务状态方法
        let obj1 = {
          channel_code: this.workDetails['channelCode'],
          id: this.workDetails['id'],
          msg_push_port: this.workDetails['msgPushPort'],
          org_code: this.workDetails['orgCode'],
          suit_code: this.workDetails['suitCode'],
          version_no:this.workDetails['versionNo'],
          workstation_code: this.workDetails['workstationCode'],
          workstation_ip: this.workDetails['workstationIp'],
          workstation_kind: this.workDetails['workstationKind'],
          workstation_name: this.workDetails['workstationName'],
          workstation_status: "1", // 暂停服务
          workstation_switch: this.workDetails['workstationSwitch']
        };
        this.commonUtils('update',obj1);
        break;
      case  'restoreserve': // 调用恢复服务方法
        let obj2= {
          channel_code: this.workDetails['channelCode'],
          id: this.workDetails['id'],
          msg_push_port: this.workDetails['msgPushPort'],
          org_code: this.workDetails['orgCode'],
          suit_code: this.workDetails['suitCode'],
          version_no:this.workDetails['versionNo'],
          workstation_code: this.workDetails['workstationCode'],
          workstation_ip: this.workDetails['workstationIp'],
          workstation_kind: this.workDetails['workstationKind'],
          workstation_name: this.workDetails['workstationName'],
          workstation_status: "0", // 恢复服务
          workstation_switch: this.workDetails['workstationSwitch']
        };
        this.commonUtils('update',obj2);
        break;
    }
  }

  // 离线数据操作
  offlineApp = []; // 默认是空

  // 看是否可以和appsessting公用，如果可以，那就公用，不行就单独抽出来
  appOffline(item) {
    switch (item.type) {
      case  'stopserve':
        let obj1 = {
          channel_code: this.workDetails['channelCode'],
          id: this.workDetails['id'],
          msg_push_port: this.workDetails['msgPushPort'],
          org_code: this.workDetails['orgCode'],
          suit_code: this.workDetails['suitCode'],
          version_no:this.workDetails['versionNo'],
          workstation_code: this.workDetails['workstationCode'],
          workstation_ip: this.workDetails['workstationIp'],
          workstation_kind: this.workDetails['workstationKind'],
          workstation_name: this.workDetails['workstationName'],
          workstation_status: "1", // 暂停服务
          workstation_switch: this.workDetails['workstationSwitch']
        };
        this.commonUtils('update',obj1);
        break;
      case  'restoreserve':
        let obj2= {
          channel_code: this.workDetails['channelCode'],
          id: this.workDetails['id'],
          msg_push_port: this.workDetails['msgPushPort'],
          org_code: this.workDetails['orgCode'],
          suit_code: this.workDetails['suitCode'],
          version_no:this.workDetails['versionNo'],
          workstation_code: this.workDetails['workstationCode'],
          workstation_ip: this.workDetails['workstationIp'],
          workstation_kind: this.workDetails['workstationKind'],
          workstation_name: this.workDetails['workstationName'],
          workstation_status: "0", // 恢复服务
          workstation_switch: this.workDetails['workstationSwitch']
        };
        this.commonUtils('update',obj2);
        break;
    }
  }

  // 通用增删改查服务封装
  commonUtils(funccode, data) {
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.TRANSACTION,
      funccode: funccode,
      svccode: 'TX001',
      requestdata: {
        coh: {},
        bdy: {
          data: data,
          tablename: "btf_workstation"
        }
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        this.message.create('success', `修改成功`);
        this.initworkInfo(); // 重新调用工作站详情接口
      }
    });
  }


  // 关闭应用
  private closeApp() {
    this.meType = 'stopApp';
    const obj = {
      "sid": '1',
      "tid": this.stationCode, 
      "data": {"msgType": "stopApp"}
    };
    this.sendMessages(obj)
  }

  // 获取日志应用
  private setapplog() {
    this.meType = 'getLogs';
    const obj = {
      "sid": '1',
      "tid": this.stationCode, 
      "data": {"msgType": "getLogs"}
    };
    this.sendMessages(obj)
  }

  // 获取日志详情
  private logDetail(name) {
    this.meType = 'logDetail';
    const obj = {
      "sid": '1',
      "tid": this.stationCode, 
      "data": {"msgType": "logDetail"}
    };
    this.sendMessages(obj);
  }

  // 应用体检
  private appCheck() {
    this.meType = 'appCheck';
    const obj = {
      "sid": '1',
      "tid": this.stationCode, 
      "data": {"msgType": "appCheck"}
    };
    this.sendMessages(obj);
  }

  // 获取外设链接信息
  private getAppinfo() {
    this.meType = 'getAppinfo';
    const obj = {
      "sid": '1',
      "tid": this.stationCode, 
      "data": {"msgType": "getAppinfo"}
    };
    this.sendMessages(obj);
  }


  // 获取是否连接上
  private connect() {
    this.meType = 'connect';
    const obj = {
      "sid": '1',
      "tid": this.stationCode,
      "data": 'connect'
    };
    this.sendMessages(obj);
    
  }
  isVisible = false; // 日志弹框界面
  isVisibleDetail = false; // 日志详情弹框
  detailModal = ''; // 日志弹出框详情




  // 查看日志详情界面，是否在用弹窗?
  logdetails(item) {
    this.detailModal = item + '日志详情';
     this.isVisible = false;
     this.isVisibleDetail = true;
     this.logDetail(item); // 暂时关闭，防止演示的时候500
  }
}


