import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { BaseTransaction } from '../../base-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from "tms-platform-component";
import { SettingService } from '../../../../service/setting.service';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { ResultData, ServiceResult } from 'tms-platform';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';
const transCode = 'tx990441';
const transName = '区块链视图';
const tableName = 'fabric_peer_channel';
const funcCode = [
  'peerCount',
  'app',
  'channel',
  'blockCount',
  'intelligentCount',
  'blockLists',
  'nodesLists',
  'blockPageList',
  'transactioCount',
  'transactionList',
  'transactionStatistics'
];

@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990441',
  templateUrl: './tx990441.component.html',
  styleUrls: ['./tx990441.component.css']
})
export class Tx990441Component extends BaseTransaction {

  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @ViewChild('divChild', {static: true}) divChild: ElementRef;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>;
  @Input('params') params: any;
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }> = new EventEmitter();
  constructor(
    private datePipe: DatePipe,
    public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient
  ) {
    super(transCode);
  }
  loadData = this.loadDataing.bind(this);
  //  父级方法;
  appData: any[] = [];
  appDataChildren: any[] = [];
  dateArrayHour: any[] = [];
  dateArrayMin: any[] = [];
  channelName: string;
  appName: string;
  isShow = false;
  topData = [
    {
      color: '#1890ff',
      number: 0,
      title: '智能合约',
      value: 'intelligentCount',
      icon: 'project'
    },
    {
      color: '#2f4554',
      number: 0,
      title: '节点',
      value: 'peerCount',
      icon: 'build'
    },
    {
      color: '#069c28',
      number: 0,
      title: '交易',
      value: 'transactioCount',
      icon: 'pic-left'
    },
    {
      color: '#c23531',
      number: 0,
      title: '块',
      value: 'blockCount',
      icon: 'global'
    }
  ];
  isPage = true;
  timeData = [];
  isSpinning = false;
  values: any[] = null;
  begin_date: any;
  end_date: any;
  nodes: any;
  flageLoad = false;
  nodesTable = {
    header: [
      {
        key: 'mspid',
        label: 'mspid'
      },
      {
        key: 'domain',
        label: 'domain'
      },
      {
        key: 'location',
        label: 'location'
      },
      {
        key: 'event_hub',
        label: 'event_hub'
      },
      {
        key: 'properties',
        label: 'properties'
      }
    ],
    data: [],
    isLoading: false
  };
  tabs = [
    {
      key: '0',
      label: '块/天'
    },
    {
      key: '1',
      label: '块/小时'
    },
    {
      key: '2',
      label: '交易/天'
    },
    {
      key: '3',
      label: '交易/小时'
    }
  ];
  showloading = true;
  chartTitle: string;
  tabKey = 0;
  channelId: string;
  page = 1;
  visible = false;
  valuesApp: any[] = null;
  appId: number;
  theme: string;
  optionsMap: any;
  x: number;
  dateRange: any;
  option: any;
  optionsMapions = {};
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    this.getApp();
    this.channelId = this.params.channelId;
    this.appId = this.params.appId;
    this.channelName = this.params.channelName;
    this.appName = this.params.appName;
    this.onChangesAppChannel();
  }


  listDataCallback(data: any): void { }

  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;
    let obj;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    ).resultdata;
    switch (tcFuncCode) {
      case 'app':
        this.appData = [];
        result.bdy.forEach(element => {
          this.appData.push({
            label: element.name,
            value: element.id,
            children: []
          });
        });
        break;
      case 'channel':
        result = TransactionContextHelper.getServiceResult(
          transactionContext,
          tcFuncCode,
          transCode
        ).resultdata;
        this.appDataChildren = [];
        result.bdy.forEach(element => {
          this.appDataChildren.push({
            value: element.id,
            label: element.name,
            isLeaf: true
          });
        });
        this.flageLoad = false;
        break;
      case 'peerCount':
        console.log('节点数量');
        console.log(result.bdy);
        obj = this.handleResult(result.bdy);
        this.setTopData(obj, 'peerCount');
        break;
      case 'blockCount':
        obj = this.handleResult(result.bdy);
        this.setTopData(obj, 'blockCount');
        console.log('块数量');
        console.log(result.bdy);
        break;
      case 'intelligentCount':
        obj = this.handleResult(result.bdy);
        this.setTopData(obj, 'intelligentCount');
        console.log('智能合约');
        console.log(result.bdy);
        break;
      case 'blockLists':
        this.dateArrayHour = [];
        this.dateArrayMin = [];
        result.bdy.forEach(element => {
          this.dateArrayMin.push(element.create_date.substr(0, 13) + ':00');
          this.dateArrayHour.push(element.create_date.substr(0, 10));
        });
        if (this.tabKey === 0) {
          this.handleChartValueOne();
        } else if (this.tabKey === 1) {
          this.handleChartValueTwo();
        }
        //  this.changeTab(0)
        this.isShow = true;
        break;
      case 'nodesLists':
        console.log('节点列表');
        console.log(result.bdy);
        this.nodesTable.data = result.bdy;
        this.nodesTable.isLoading = false;
        break;
      case 'transactioCount':
        obj = this.handleResult(result.bdy);
        this.setTopData(obj, 'transactioCount');
        console.log('交易数量');
        console.log(result.bdy);
        break;
      case 'blockPageList':
        console.log(result.bdy);
        this.isSpinning = false;
        if (result.bdy.length === 0) {
          this.isPage = false;
        } else {
          result.bdy.forEach(element => {
            const time = new Date(element.create_date);
            element.time = this.timeago(time);
            this.timeData.push(element);
          });
          this.isPage = true;
        }
        break;
      case 'transactionList':
        this.dateArrayHour = [];
        this.dateArrayMin = [];

        result.bdy.forEach(element => {
          //  element.write_set = element.write_set.substr(
          //    1,
          //    element.write_set.length - 2
          //  )

          //  element.write_set = JSON.parse(element.write_set)

          this.dateArrayMin.push(element.create_date.substr(0, 13) + ':00');
          this.dateArrayHour.push(element.create_date.substr(0, 10));
        });
        console.log(result.bdy);

        if (this.tabKey === 2) {
          this.handleChartValueOne();
        } else if (this.tabKey === 3) {
          this.handleChartValueTwo();
        }
        break;
      case 'transactionStatistics':
        console.log(result.bdy);

        let X = [];
        let Y = [];
        result.bdy.forEach(element => {
          X.push(element.creator_mspid);
          Y.push({ value: element.count, name: element.creator_mspid });
        });

        this.setChart(X, Y);
        break;
    }
  }
  timeago(dateTimeStamp) {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const now = new Date().getTime();
    console.log(now);
    const diffValue = now - dateTimeStamp;

    if (diffValue < 0) {
      return;
    }
    let monthC;
    let minC;
    let weekC;
    let dayC;
    let hourC;
    minC = diffValue / minute; // 计算时间差的分，时，天，周，月
    hourC = diffValue / hour;
    dayC = diffValue / day;
    weekC = diffValue / week;
    monthC = diffValue / month;
    let result;
    if (monthC >= 1 && monthC <= 3) {
      result = ' ' + parseInt(monthC) + '月前';
    } else if (weekC >= 1 && weekC <= 3) {
      result = ' ' + parseInt(weekC) + '周前';
    } else if (dayC >= 1 && dayC <= 6) {
      result = ' ' + parseInt(dayC) + '天前';
    } else if (hourC >= 1 && hourC <= 23) {
      result = ' ' + parseInt(hourC) + '小时前';
    } else if (minC >= 1 && minC <= 59) {
      result = ' ' + parseInt(minC) + '分钟前';
    } else if (diffValue >= 0 && diffValue <= minute) {
      result = '刚刚';
    } else {
      const datetime = new Date();
      datetime.setTime(dateTimeStamp);
      const Nyear = datetime.getFullYear();
      const Nmonth =
        datetime.getMonth() + 1 < 10
          ? '0' + (datetime.getMonth() + 1)
          : datetime.getMonth() + 1;
      const Ndate =
        datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate()
      /*      const Nhour =
              datetime.getHours() < 10
                ? '0' + datetime.getHours()
                : datetime.getHours();
            const Nminute =
              datetime.getMinutes() < 10
                ? '0' + datetime.getMinutes()
                : datetime.getMinutes();
            const Nsecond =
              datetime.getSeconds() < 10
                ? '0' + datetime.getSeconds()
                : datetime.getSeconds();*/
      result = Nyear + '-' + Nmonth + '-' + Ndate;
    }
    return result;
  }

  // 处理返回值
  handleResult(data) {
    let obj;
    data.forEach(element => {
      obj = element.count;
    });
    return obj;
  }
  // 处理图表数据返回值
  handleChartValueOne() {
    this.dateArrayHour.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const arr = this.dateArrayHour.reduce(
      (m, x) => m.set(x, (m.get(x) || 0) + 1),
      new Map()
    );
    const dataLineY = Array.from(arr.values()); // 出现次数
    const dataLineX = Array.from(arr.keys()); // 去重
    this.setLineChart(dataLineX, dataLineY);
  }
  handleChartValueTwo() {
    this.dateArrayMin.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    const arrX = this.dateArrayMin.reduce(
      (m, x) => m.set(x, (m.get(x) || 0) + 1),
      new Map()
    );
    const objArray = [];
    for (let i = 0; i < Array.from(arrX).length; i++) {
      objArray.push({
        label: Array.from(arrX)[i][0],
        value: Array.from(arrX)[i][1]
      });
    }
    const nowObj = Math.round(new Date().getTime());
    const obj = nowObj - 24 * 3600 * 1000;
    const arrTime = [];
    for (let i = obj; i < nowObj; i = i + 3600000) {
      arrTime.push({
        label: this.datePipe.transform(i, 'yyyy-MM-dd HH') + ':00',
        count: 0
      });
    }
    const dataLineX = [];
    const dataLineY = [];
    console.log(arrTime);

    arrTime.forEach(i => {
      objArray.forEach(j => {
        if (i.label === j.label) {
          i.count = j.value;
        }
      });
      dataLineX.push(i.label);
      dataLineY.push(i.count);
    });

    this.setLineChart(dataLineX, dataLineY);
  }


  loadDataing(node: any, index: number): PromiseLike<any> {
    return new Promise(resolve => {
      if (index < 0) {
        node.children = this.appData;
        resolve();
      } else if (index === 0) {
        this.flageLoad = true;
        this.getAppChannel(node.value);
        let interval = setInterval(() => {
          if (!this.flageLoad) {
            clearInterval(interval);
            node.children = this.appDataChildren;
            resolve();
          }
        }, 1000);
      }
    });
  }


  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  onChangesAppID(values: any): void {
    console.log(values);
    this.appId = values.option.value;

    this.getAppChannel(this.appId);
  }

  onChangesAppChannel() {
    let time = Math.round(new Date().getTime()) - 24 * 3600 * 1000 * 7;
    this.begin_date = this.datePipe.transform(time, 'yyyy-MM-dd');
    this.end_date = this.datePipe.transform(
      Math.round(new Date().getTime()),
      'yyyy-MM-dd'
    );
    this.dateRange = [this.begin_date, this.end_date]
    this.x = 0;
    console.log(this.appId);

    //  this.countSecond()
    this.getPeerCount();
    this.getBlockCount();
    this.getIntelligentCount();
    this.getTransactioCount();
    this.getTransactioCountList();
    this.getBlockLists();
    this.getNodesLists();
    this.getBolckPageLists();
    this.gettransactionStatistics();
  }

  //  countSecond() {
  //    this.x = this.x + 1

  //    //  let interval
  //    console.log(this.x)

  //    let obj = true
  //    switch (this.x) {
  //      case 1:
  //        this.getPeerCount()
  //        break
  //      case 2:
  //        this.getBlockCount()
  //        break
  //      case 3:
  //        this.getIntelligentCount()
  //        break
  //      case 4:
  //        this.getTransactioCountList()
  //        break
  //      case 5:
  //        this.getBlockLists()
  //        break
  //      case 6:
  //        this.getNodesLists()
  //        break
  //      case 7:
  //        this.getBolckPageLists()
  //        break
  //      case 8:
  //        this.gettransactionStatistics()
  //        break
  //      default:
  //        //  clearInterval(interval)
  //        this.x = 0
  //        obj = false
  //        break
  //    }
  //    if (obj) {
  //      setTimeout(() => {
  //        this.countSecond()
  //      }, 500)
  //    }
  //  }

  // 处理数组
  setTopData(number, key) {
    this.topData.forEach(i => {
      if (i.value === key) {
        i.number = number;
      }
    });
  }



  onChanges(values: any): void {
    this.isShow = true;
    console.log(values, this.values);
  }

  changeTab(event) {
    this.tabKey = event;
    switch (event) {
      case 0:
        this.chartTitle = '每天生成的块';
        this.getBlockLists();
        //  this.handleChartValueOne()
        break;
      case 1:
        this.chartTitle = '每小时生成的块';
        this.getBlockLists();
        //  this.handleChartValueTwo()
        break;
      case 2:
        this.chartTitle = '每天生成的交易';
        this.getTransactioCountList();
        //  this.handleChartValueOne()
        break;
      case 3:
        this.chartTitle = '每小时生成的交易';
        this.getTransactioCountList();
        //  this.handleChartValueTwo()
        break;
    }
  }

  changeDate() {
    this.begin_date = this.datePipe.transform(
      Math.round(this.dateRange[0].getTime()),
      'yyyy-MM-dd'
    );
    this.end_date = this.datePipe.transform(
      Math.round(this.dateRange[1].getTime()),
      'yyyy-MM-dd'
    );
    if (this.tabKey === 0) {
      this.getBlockLists();
    } else {
      this.getTransactioCountList();
    }
  }

  setLineChart(dataLineX, dataLineY) {
    this.option = {
      title: [
        {
          left: 'center',
          text: this.chartTitle
        }
      ],
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: dataLineX
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: dataLineY,
          type: 'line'
        }
      ]
    };

  }


  setChart(dataLineX, dataLineY) {
    this.optionsMap = {
      title: {
        text: '交易记录',
        subtext: 'Transactions by Organization',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        //  orient: 'vertical',
        //  top: 'middle',
        bottom: 10,
        left: 'center',
        data: dataLineX
      },
      series: [
        {
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: dataLineY,
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
    //  this.optionsMap = {
    //    title: {
    //      text: '交易记录',
    //      subtext: 'Transactions by Organization',
    //      x: 'center'
    //    },
    //    tooltip: {
    //      trigger: 'item',
    //      formatter: '{a} <br/>{b} : {c} ({d}%)'
    //    },
    //    legend: {
    //      x: 'center',
    //      y: 'bottom',
    //      data: dataLineX
    //    },
    //    calculable: true,
    //    series: [
    //      {
    //        name: 'area',
    //        type: 'pie',
    //        radius: [30, 110],
    //        roseType: 'area',
    //        data: dataLineY
    //      }
    //    ]
    //  }
  }

  // 滚动条事件

  handleScroll(event) {
    const nScrollHight = this.divChild.nativeElement.scrollHeight;
    const nScrollTop = this.divChild.nativeElement.scrollTop;
    const nDivHight = this.divChild.nativeElement.clientHeight;

    if (nScrollTop + nDivHight >= nScrollHight) {
      if (this.isPage) {
        this.isSpinning = true;
        this.page++;
        console.log(this.page);
        this.getBolckPageLists();
      }
    } else {
      console.log('离开');
    }
  }
  // 获取应用
  getApp() {
    const obj = {};
    this.submit('TX002', 'app', 'block_chain.blkchainApps', obj)
  }
  // 获取应用下通道
  getAppChannel(it) {
    const obj = {
      app_id: it
    };

    this.submit('TX002', 'channel', 'block_chain.fabricChannelByAppId', obj);
  }
  //  获取节点数量
  getPeerCount() {
    const obj = {
      channel_id: this.channelId
    };
    this.nodesTable.isLoading = true;
    this.submit('TX002', 'peerCount', 'block_chain.nodesNumber', obj)
  }
  //  获取只能合约数量
  getIntelligentCount() {
    const obj = {
      app_id: this.appId,
      channel_id: this.channelId
    };

    this.submit(
      'TX002',
      'intelligentCount',
      'block_chain.intelligentContractNumber',
      obj
    );
  }
  //  获取块数量
  getBlockCount() {
    let obj = {
      channel_id: this.channelId
    };
    this.submit('TX002', 'blockCount', 'block_chain.blockNumber', obj)
  }
  //  获取交易数量
  getTransactioCount() {
    let obj = {
      channel_id: this.channelId
    };
    this.submit(
      'TX002',
      'transactioCount',
      'block_chain.transactionNumber',
      obj
    );
  }
  // 获取交易列表
  getTransactioCountList() {
    let begin;
    let end;
    if (this.tabKey === 3) {
      const nowObj = Math.round(new Date().getTime());
      let obj = nowObj - 24 * 3600 * 1000;
      begin = this.datePipe.transform(obj, 'yyyy-MM-dd HH:mm:ss');
      end = this.datePipe.transform(nowObj, 'yyyy-MM-dd HH:mm:ss');
    } else {
      begin = this.begin_date + ' 00:00:00';
      end = this.end_date + ' 23:59:59';
    }
    const obj = {
      channel_id: this.channelId,
      begin_date: begin,
      end_date: end
    };
    this.submit('TX002', 'transactionList', 'block_chain.transactionList', obj);
  }
  //  获取块列表

  getBlockLists() {
    let begin;
    let end;
    if (this.tabKey === 1) {
      const nowObj = Math.round(new Date().getTime());
      let obj = nowObj - 24 * 3600 * 1000;
      begin = this.datePipe.transform(obj, 'yyyy-MM-dd HH:mm:ss');
      end = this.datePipe.transform(nowObj, 'yyyy-MM-dd HH:mm:ss');
    } else {
      begin = this.begin_date + ' 00:00:00';
      end = this.end_date + ' 23:59:59';
    }
    const obj = {
      channel_id: this.channelId,
      begin_date: begin,
      end_date: end
    };
    this.submit('TX002', 'blockLists', 'block_chain.blockLists', obj)
  }

  //  获取节点列表
  getNodesLists() {
    const obj = { channel_id: this.channelId };
    this.submit('TX002', 'nodesLists', 'block_chain.nodesLists', obj);
  }
  getBolckPageLists() {
    const pageSize = 5;

    const currIndex = (this.page - 1) * pageSize;
    const obj = {
      channel_id: this.channelId,
      currIndex: currIndex,
      pageSize: pageSize
    };
    this.submit('TX002', 'blockPageList', 'block_chain.blockLists', obj)
  }
  //  获取交易统计信息
  gettransactionStatistics() {
    const obj = { channel_id: this.channelId };
    this.submit(
      'TX002',
      'transactionStatistics',
      'block_chain.transactionStatistics',
      obj
    );
  }
}
