import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';
import { BaseTransaction } from '../../base-transaction';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { HttpClient } from '@angular/common/http';
import { BsaApi, ServiceRequest, ServiceTypeEnum } from 'tms-platform';
import { DatePipe } from '@angular/common';
import { IfearmService } from '../../../../service/ifearm.service';
import * as echarts from 'echarts';
import '../../../../../../node_modules/echarts/extension/bmap/bmap.js';
import { TransCommonApiHelper } from '../../trans-common-api-helper';
const transCode = 'tx990510';
const transName = '热度分布';
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
  selector: 'app-tx990510',
  templateUrl: './tx990510.component.html',
  styleUrls: ['./tx990510.component.css'],
})
export class Tx990510Component extends BaseTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
5
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
    private elementRef: ElementRef,
    private bsaApi: BsaApi,
    private datePipe: DatePipe,
    private ifearm: IfearmService,

  ) {
    super(transCode);
  }
  temp = false;
  timeData = [
    {
      label: '今天',
      value: 0
    }, {
      label: '昨天',
      value: 1
    }, {
      label: '最近7天',
      value: 2
    }, {
      label: '最近30天',
      value: 3
    }];
  selectedValue = {
    area: null,
    txCode: null,
    channel: null
  };
  center = [104.114129, 37.550339];
  zoom = 5;
  sumValue = 0;
  isClick = true;
  someTime = [];
  area = [];
  channel = [];
  trans = [];
  mapIntance: any;
  optionsMap = {
    title: {
      text: '全国主要城市交易量分布',
      left: 'center'

    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return params.seriesName + '<br/>' + params.name + ': ' + params.value[2];
      }
    },
    bmap: {
      center: [104.114129, 37.550339],
      zoom: 5,
      roam: true,
      mapStyle: {
        styleJson: [{
          'featureType': 'water',
          'elementType': 'all',
          'stylers': {
            'color': '#d1d1d1'
          }
        }, {
          'featureType': 'land',
          'elementType': 'all',
          'stylers': {
            'color': '#f3f3f3'
          }
        }, {
          'featureType': 'railway',
          'elementType': 'all',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'highway',
          'elementType': 'all',
          'stylers': {
            'color': '#fdfdfd'
          }
        }, {
          'featureType': 'highway',
          'elementType': 'labels',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'arterial',
          'elementType': 'geometry',
          'stylers': {
            'color': '#fefefe'
          }
        }, {
          'featureType': 'arterial',
          'elementType': 'geometry.fill',
          'stylers': {
            'color': '#fefefe'
          }
        }, {
          'featureType': 'poi',
          'elementType': 'all',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'green',
          'elementType': 'all',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'subway',
          'elementType': 'all',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'manmade',
          'elementType': 'all',
          'stylers': {
            'color': '#d1d1d1'
          }
        }, {
          'featureType': 'local',
          'elementType': 'all',
          'stylers': {
            'color': '#d1d1d1'
          }
        }, {
          'featureType': 'arterial',
          'elementType': 'labels',
          'stylers': {
            'visibility': 'off'
          }
        }, {
          'featureType': 'boundary',
          'elementType': 'all',
          'stylers': {
            'color': '#fefefe'
          }
        }, {
          'featureType': 'building',
          'elementType': 'all',
          'stylers': {
            'color': '#d1d1d1'
          }
        },
        {
          'featureType': 'label',
          'elementType': 'all',
          'stylers': {
            'visibility': 'off'
          }
        }]
      }
    },
    series: [
      {
        name: '所在城市交易量',
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: [],
        symbolSize: (val) => {

          const obj = (Number(val[2]) / this.sumValue) * 20;
          return 5 + obj;
        },
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: false
          }
        },
        itemStyle: {
          normal: {
            color: 'purple'
          }
        }
      },
      {
        name: 'Top 5',
        type: 'effectScatter',
        coordinateSystem: 'bmap',
        data: [],
        symbolSize: (val) => {

          const obj = (Number(val[2]) / this.sumValue) * 20;
          return 5 + obj;
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: 'purple',
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        zlevel: 1
      }
    ]
  };
  mapData = [];
  isLoading = false;
  city: any;
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
        key: 'customer_name',
        label: '省市（合计）'
      },
      {
        key: 'customer_tel',
        label: '存款业务'
      },
      {
        key: 'sex',
        label: '贷款业务',
      },
      {
        key: 'sex',
        label: '理财业务',
      }
    ],
  };
  loading = false;
  dataList = [
    {
      title: 'Ant Design Title 1'
    },
    {
      title: 'Ant Design Title 2'
    },
    {
      title: 'Ant Design Title 3'
    },
    {
      title: 'Ant Design Title 4'
    }
  ];
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    setTimeout(() => {
      this.temp = true;
    });
    this.queryarea();
    this.querychannel();
    this.querytrans();
    this.getFirstChart();
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
        this.area = result.bdy.data;
        break;
      case 'infoQuery':
        // this.trans = result.bdy.data;
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
  queryarea() {
    TransCommonApiHelper.conditionQuery(this, 'areaQuery', {
      tablename: 'ctf_city_area',
      page: '1',
      pagesize: '999',
      params: [{
        'logic': 'AND',
        'queryList': [{
          'logic': 'AND',
          'operator': 'EQ',
          'params': ['plevel', '1']
        }]
      }]

    });
  }
  querytrans() {
    // TransCommonApiHelper.conditionQuery(this, 'infoQuery', {
    //   tablename: 'btf_trans_info',
    //   page: '1',
    //   pagesize: '999'
    // });
  }
  onMapInit(event) {
    this.mapIntance = event;
  }
  setMapChart(center, zoom, title, color) {
    this.optionsMap.title.text = title;
    this.optionsMap.bmap.center = center;
    this.optionsMap.bmap.zoom = zoom;
    this.optionsMap.series[0].data = this.mapData;
    this.optionsMap.series[1].data = this.mapData.slice(0, 6);
    this.optionsMap.series[0].itemStyle.normal.color = color;
    this.optionsMap.series[1].itemStyle.normal.color = color;
    this.mapIntance.setOption(this.optionsMap);
    this.isLoading = false;
  }


  getRrason(code?) {
    let sdate = null;
    let edate = null;
    let area = this.selectedValue.area;
    if (this.someTime.length === 2) {
      sdate = this.datePipe.transform(this.someTime[0], 'yyyy-MM-dd') + ' 00:00:00';
      edate = this.datePipe.transform(this.someTime[1], 'yyyy-MM-dd') + ' 23:59:59';
    }

    if (code) {
      area = code;
    }
    const bdy = {
      area: area,
      txCode: this.selectedValue.txCode,
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

  getFirstChart() {
    this.isLoading = true;
    const bdy = this.getRrason();
    let obj = [104.114129, 37.550339];
    let zoom = 5;
    let title = '全国主要城市交易量分布';
    for (let i = 0; i < this.area.length; i++) {
      if (this.selectedValue.area === this.area[i].pid) {
        obj = [this.area[i].latitude, this.area[i].longitude];
        zoom = 10;
        title = this.area[i].pname + '交易量分布';
        delete bdy.area;
        break;
      }
    }
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.TRANSACTION,
      funccode: 'citycount',
      svccode: 'TX400006',
      requestdata: {
        coh: {}, bdy: bdy
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        this.isClick = true;
        this.mapData = data.resultdata.bdy.count;
        this.sumValue = 0;
        this.mapData.forEach(i => {
          this.sumValue += Number(i.value[2]);
        });
        this.mapData.sort((a, b) => {

          return b.value[2] - a.value[2];
        });
        this.setMapChart(obj, zoom, title, 'purple');

      }
    });
  }
  chartClick(event) {
    if (this.isClick) {
      const bdy = this.getRrason(event.data.code);
      const serviceRequest: ServiceRequest = {
        svctype: ServiceTypeEnum.TRANSACTION,
        funccode: 'areacount',
        svccode: 'TX400006',
        requestdata: {
          coh: {}, bdy: bdy
        }
      };
      this.isLoading = true;
      this.bsaApi.asynCall(serviceRequest).subscribe(data => {
        if (data.returncode === '000000') {
          this.city = event;
          this.isClick = false;
          this.mapData = data.resultdata.bdy.count;
          this.sumValue = 0;
          this.mapData.forEach(i => {
            this.sumValue += Number(i.value[2]);
          });
          this.mapData.sort((a, b) => {
            console.log(a, b);
            return b.value[2] - a.value[2];
          });
          this.setMapChart([event.value[0], event.value[1]], 11, event.data.name + '交易量分布', 'purple');
        }
      });
    }
  }

  timeClick(event) {
    let timer;

    switch (event.value) {
      case 0:
        timer = this.ifearm.timeForMat(0);
        break;
      case 1:
        timer = this.ifearm.timeForMat(-1);
        break;
      case 2:
        timer = this.ifearm.timeForMat(7);
        break;
      case 3:
        timer = this.ifearm.timeForMat(30);
        break;
    }
    this.someTime = timer;
    this.changeSelect();

  }
  changeSelect() {

    if (this.isClick) {
      this.getFirstChart();
    } else {
      this.isClick = true;
      this.chartClick(this.city);

    }
  }

  getData(callback: (res: any) => void): void {
    // this.http.get(fakeDataUrl).subscribe((res: any) => callback(res));
  }

  imgScroll(event) {

    const scrollHeight = event.target.scrollHeight;
    const scrollTop = event.target.scrollTop;
    const clientHeight = event.target.clientHeight;
    if (scrollHeight - clientHeight === scrollTop) {
      // 滚动条滚到最底部,
      // this.imgCurrentPage++;
      // this.getDockerVersion();

    }
  }
}
