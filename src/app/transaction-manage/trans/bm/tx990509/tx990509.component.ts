import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';
import { BaseTransaction } from '../../base-transaction';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';
import { TransCommonApiHelper } from '../../trans-common-api-helper';
import { DatePipe } from '@angular/common';
import { BsaApi, ServiceRequest, ServiceTypeEnum } from 'tms-platform';
import { IfearmService } from '../../../../service/ifearm.service';

const transCode = 'tx990509';
const transName = '活跃度统计';
const tableName = '';
const exFuncCode = ['channelQuery', 'areaQuery', 'infoQuery'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};

@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990509',
  templateUrl: './tx990509.component.html',
  styleUrls: ['./tx990509.component.css'],
})
export class Tx990509Component extends BaseTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>;
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }> = new EventEmitter();
  constructor(public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private bsaApi: BsaApi,
    private datePipe: DatePipe,
    private message: NzMessageService,
    private ifearm: IfearmService,
  ) {
    super(transCode);
  }
  theme: string;
  temp = false;
  tabs = [
    { title: '成功／失败交易活跃度监控', index: 0, src:'./assets/newimage/Insight/btn_selected.png' },
    { title: '活跃交易监控排行', index: 1, src:'./assets/newimage/Insight/btn_normal.png' },
    { title: '渠道交易频率&久眠交易监控', index: 2, src:'./assets/newimage/Insight/btn_normal.png' }
  ];
  optionsAssets = {};
  optionsMap = {};
  optionsFinancial = {};
  styleDiv = {
    padding: '24px 0 0 0'
  };
  optionsTransaction = {};
  optionsBank = {};
  optionsIT = {};
  optionFunnel = {};
  // timeData = ['今天', '昨天', '最近7天', '最近30天'];
  selectedValue = {
    rank: 50,
    type: 0,
    txcode: null,
    channel: null
  };
  typeTime = [
    { label: '按年统计', value: 0 },
    { label: '按月统计', value: 1 },
    { label: '按日统计', value: 2 },
    { label: '按时统计', value: 3 },
  ];
  trans = [];
  channel = [];
  queryModel = {
    data: [],
    condition: {
      pagesize: 0
    },
    topActions: [],
    rowActions: [],
    totalCount: 0,
    isLoading: false,
    header: [
      {
        key: 'trans_name',
        label: '交易'
      },
      {
        key: 'succ_count',
        label: '成功笔数'
      },
      {
        key: 'fail_count',
        label: '失败笔数'
      }

    ],
  };
  mapIntance: any;
  queryTransaction = {
    data: [],
    condition: {
      pagesize: 0
    },
    topActions: [],
    rowActions: [],
    totalCount: 0,
    isLoading: false,
    header: [
      {
        key: 'trans_name',
        label: '交易名称'
      },
      {
        key: 'trans_code',
        label: '交易代码'
      },
      {
        key: 'trans_num',
        label: '交易笔数',
      }
    ],
  };
  queryFrequency = {
    data: [],
    condition: {
      pagesize: 0
    },
    totalCount: 0,
    isLoading: false,
    topActions: [],
    rowActions: [],
    header: [
      {
        key: 'customer_name',
        label: '交易频率'
      },
      {
        key: 'customer_tel',
        label: '交易笔数'
      },
      {
        key: 'sex',
        label: '交易状态',
      },
      {
        key: 'sex',
        label: '交易流水数',
      }
    ],
  };
  listOfOption = [
    { label: '超级柜面', value: '0' },
    { label: '移动柜面', value: '1' },
    { label: '柜面', value: '2' },
  ];
  someTime = [];
  listOfSelectedValue = ['0'];
  SelectedIndex = 0;
  dataX: any;
  dataS: any;
  dataF: any;
  isLoading = false;
  transChild = [];
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    setTimeout(() => {
      this.temp = true;
      this.setTransaction('全部渠道前' + this.selectedValue.rank + '活跃交易监控');
    });

    this.someTime = this.ifearm.timeForMat(365);
    this.querychannel();
    this.querytrans();
    this.setFunnelChart();
    // this.mapIntance

    this.changTab(0);
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

    switch (tcFuncCode) {
      case 'channelQuery':
        this.channel = result.bdy.data;
        break;
      case 'areaQuery':

        break;
      case 'infoQuery':
        result.bdy.data.forEach(i => {
          i.trans_num = Math.round(Math.random() * 100) + 1;
        });
        this.trans = result.bdy.data;
        this.transChild = this.trans;
        break;
    }
  }
  querychannel() {
    TransCommonApiHelper.conditionQuery(this, 'channelQuery', {
      tablename: 'btf_branch_channel',
      page: '1',
      pagesize: '999'


    });
  }

  querytrans() {
    TransCommonApiHelper.conditionQuery(this, 'infoQuery', {
      tablename: 'btf_trans_info',
      page: '1',
      pagesize: '30'
    });
  }

  changTab(event) {
    console.log(event);
    switch (event) {
      case 0:
        this.getFirstChart();
        break;
      case 1:

        this.getSecondChart();
        break;
      case 2:
        break;
    }
  }
  radioChange(type?) {

    switch (this.SelectedIndex) {
      case 0:
        this.getFirstChart();
        break;
      case 1:
        if (type) {
          this.getSecondChart(type);

        } else {
          this.getSecondChart();

        }
        break;
      case 2:
        break;
    }

  }
  getRrason() {
    let sdate = null;
    let edate = null;
    if (this.someTime.length === 2) {
      sdate = this.datePipe.transform(this.someTime[0], 'yyyy-MM-dd') + ' 00:00:00';
      edate = this.datePipe.transform(this.someTime[1], 'yyyy-MM-dd') + ' 23:59:59';
    } else {
      this.message.create('error', `时间范围不能为空`);
      return;
    }
    const bdy = {
      type: this.selectedValue.type,
      rank: this.selectedValue.rank,
      txcode: this.selectedValue.txcode,
      channel: this.selectedValue.channel,
      sdate: sdate,
      edate: edate
    };

    for (const key in bdy) {
      if (bdy.hasOwnProperty(key)) {
        const element = bdy[key];
        if (element === null || element === '' || element === undefined) {
          delete bdy[key];
        }
      }
    }
    return bdy;
  }
  onMapInit(event) {
    this.mapIntance = event;
  }
  setLineChart() {
    const timeData = this.dataX;
    this.optionsBank = {
      title: {
        text: '成功／失败交易活跃度监控',
        textStyle: {
          fontWeight: "normal",
          color: "#fff"
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        }
      },
      legend: {
        data: ['成功', '失败'],
        textStyle: {
          fontSize: 18,
          color: '#fff'
        }
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      axisPointer: {
        link: { xAxisIndex: 'all' }
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 30,
          end: 70,
          xAxisIndex: [0, 1]
        },
        {
          type: 'inside',
          realtime: true,
          start: 30,
          end: 70,
          xAxisIndex: [0, 1]
        }
      ],
      grid: [
        {
        left: 50,
        right: 50,
        height: '35%'
      },
        {
        left: 50,
        right: 50,
        top: '55%',
        height: '35%'
      }],
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            onZero: true,
            lineStyle: {
              color: '#fff'
            }},
          data: timeData,
          nameTextStyle: {
            color: '#fff'
          }
        },
        {
          gridIndex: 1,
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: true,
            lineStyle: {
              color: '#fff'
            }},
          data: timeData,
          position: 'top',
          nameTextStyle: {
            color: '#fff'
          }
        },
      ],
      yAxis: [
        {
          name: '成功(笔/s)',
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }},
        },
        {
          gridIndex: 1,
          name: '失败(笔/s)',
          type: 'value',
          inverse: true,
          axisLine: {
            lineStyle: {
              color: '#fff'
            }}
        }
      ],
      series: [
        {
          name: '成功',
          type: 'line',
          symbolSize: 8,
          hoverAnimation: false,
          data: this.dataS
        },
        {
          name: '失败',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbolSize: 8,
          hoverAnimation: false,
          data: this.dataF
        }
      ]
    };
    this.isLoading = false;
    this.mapIntance.setOption(this.optionsBank)

  }
  setTransaction(title) {
    this.optionsTransaction = {
      title: {
        text: title,
        textStyle: {
          fontWeight: "normal",
          color: "#fff"
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} <br/>{a} : {c}'
      },
      angleAxis: {
        type: 'category',
        data: this.dataX,
        z: 10,
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      radiusAxis: {
      },
      polar: {
      },
      series: [{
        type: 'bar',
        data: this.dataS,
        coordinateSystem: 'polar',
        name: '成功',
        stack: 'a'
      }, {
        type: 'bar',
        data: this.dataF,
        coordinateSystem: 'polar',
        name: '失败',
        stack: 'a'
      }],
      legend: {
        show: true,
        data: ['成功', '失败'],
        textStyle: {
          fontSize: 18,
          color: '#fff'
        }
      }
    };
    this.isLoading = false;
    this.mapIntance.setOption(this.optionsTransaction);
  }

  setFunnelChart() {
    this.optionFunnel = {
      title: {
        text: '柜面交易频率漏洞',
        textStyle: {
          fontWeight: "normal",
          color: "#fff"
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
      },
      series: [
        {
          name: '漏斗图',
          type: 'funnel',
          label: {
            normal: {
              position: 'left',
              fontSize: 18
            }
          },
          data: [
            { value: 60, name: '每年' },
            { value: 2, name: '久眠交易' },
            { value: 60, name: '每季度' },
            { value: 30, name: '每月' },
            { value: 10, name: '每周' },
            { value: 80, name: '每天' },
            { value: 100, name: '所有交易' }
          ]
        }
      ]
    };
  }

  chartClick(event) {
    console.log(event);
    this.transChild = [];
    let num = 2;
    switch (event.data.name) {
      case '所有交易':
        this.transChild = this.trans;
        break;
      case '每天':
        num = Math.round(this.trans.length * 0.8);
        this.transChild = this.trans.slice(0, num);
        break;
      case '每周':
        num = Math.round(this.trans.length * 0.1);
        this.transChild = this.trans.slice(0, num);
        break;
      case '每月':
        num = Math.round(this.trans.length * 0.3);
        this.transChild = this.trans.slice(0, num);
        break;
      case '每季度':
        num = Math.round(this.trans.length * 0.6);
        this.transChild = this.trans.slice(0, num);
        break;
      case '久眠交易':
        num = Math.round(this.trans.length * 0.02);
        this.transChild = this.trans.slice(0, num);
        break;
      case '每年':
        num = Math.round(this.trans.length * 0.6);
        this.transChild = this.trans.slice(0, num);
        break;
    }
  }
  getFirstChart() {
    const bdy = this.getRrason();
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.TRANSACTION,
      funccode: 'activecount',
      svccode: 'TX400006',
      requestdata: {
        coh: {}, bdy: bdy
      }
    };
    this.dataX = [];
    this.dataS = [];
    this.dataF = [];
    this.isLoading = true;
    console.log(bdy);

    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        data.resultdata.bdy.count.forEach(i => {
          let objSt; objSt = [];
          let objString;
          switch (this.selectedValue.type) {
            case 1:
              objSt[0] = i.axis.substr(0, 4);
              objSt[1] = i.axis.substr(4, 2);
              objString = objSt.join('/');
              break;
            case 2:
              objSt[0] = i.axis.substr(0, 4);
              objSt[1] = i.axis.substr(4, 2);
              objSt[2] = i.axis.substr(6, 2);
              objString = objSt.join('/');
              break;
            case 3:
              objSt[0] = i.axis.substr(0, 4);
              objSt[1] = i.axis.substr(4, 2);
              objSt[2] = i.axis.substr(6, 2);
              objSt[3] = i.axis.substr(8, 2);
              objString = objSt[0] + '/' + objSt[1] + '/' + objSt[2] + ' ' + objSt[3] + ':00';
              break;
            default:
              objString = i.axis;
              break;
          }
          this.dataX.push(objString);
          this.dataS.push(Number(i.succ_count));
          this.dataF.push(Number(i.fail_count));
        });
        this.setLineChart();
      }
    });
  }
  channelChange() {

  }
  getSecondChart(type?) {
    const bdy = this.getRrason();
    this.dataX = [];
    this.dataS = [];
    this.dataF = [];
    let channel;
    if (type) {
      if (bdy.channel) {
        channel = bdy.channel;
        delete bdy.channel;
      }
    }

    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.TRANSACTION,
      funccode: 'rankcount',
      svccode: 'TX400006',
      requestdata: {
        coh: {}, bdy: bdy
      }
    };

    this.isLoading = true;

    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      let datas = [];
      let channelName = '全部渠道';
      if (data.returncode === '000000') {
        if (channel !== undefined) {
          this.channel.forEach(i => {
            if (i.channel_code === channel) {
              channelName = i.channel_name;
            }
          });
          datas = data.resultdata.bdy.count[channel];
        } else {
          datas = data.resultdata.bdy.count.all;
        }
        datas.forEach(i => {
          this.dataX.push(i.trans_name);
          this.dataS.push(Number(i.succ_count));
          this.dataF.push(Number(i.fail_count));
        });
        const title = channelName + '前' + this.selectedValue.rank + '活跃交易监控';
        this.queryModel.data = datas;
        this.setTransaction(title);
      }
    });
  }
  rowActionsHandler(event) {

  }
  rowActiveHandler(event) {

  }
  topActionsHandler(event) {

  }
  pageChange(event) {

  }
  selectRowsHandler(event) {

  }

  // 点击tab事件
  clickTab(item) {
    this.SelectedIndex = item.index;
    switch (this.SelectedIndex) {
      case 0:
        this.getFirstChart();
        break;
      case 1:
        this.getSecondChart();
        break;
      case 2:
        break;
    }
    this.tabs.forEach((i) => {
        if(i.index === item.index) {
          i.src  = './assets/newimage/Insight/btn_selected.png'
        } else {
          i.src  = './assets/newimage/Insight/btn_normal.png'
        }
    })

  }

}
