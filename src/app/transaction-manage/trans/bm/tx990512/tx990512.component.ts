import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import {FormComponent} from "tms-platform-component";
import { SettingService } from '../../../../service/setting.service';
import { BaseTransaction } from '../../base-transaction';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { HttpClient } from '@angular/common/http';
import { TransCommonApiHelper } from '../../trans-common-api-helper';
import * as echarts from 'echarts';
import '../../../../../../node_modules/echarts/extension/bmap/bmap.js';
import { IfearmService } from '../../../../service/ifearm.service';
import { BsaApi, ServiceTypeEnum, ServiceRequest } from 'tms-platform';
import { DatePipe } from '@angular/common';

const transCode = 'tx990512';
const transName = '交易分析';
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
  selector: 'app-tx990512',
  templateUrl: './tx990512.component.html',
  styleUrls: ['./tx990512.component.css'],
})
export class Tx990512Component extends BaseTransaction {
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
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{
    type: string
    transCode: string
    params: any
  }> = new EventEmitter();
  constructor(public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private ifearm: IfearmService,
    private datePipe: DatePipe,
    private message: NzMessageService,
    private bsaApi: BsaApi,



  ) {
    super(transCode);
  }
  temp = false;
  data = [];
  optionsMap = {};
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
  selectedValue = {
    type: 0,
    code: 'MENU-CORP-DEPO-HQCK',
    channel: null
  };
  someTime = [];
  area = [];
  channel = [];
  trans = [];
  mapIntance: any;
  typeTime = [
    { label: '按年统计', value: 0 },
    { label: '按月统计', value: 1 },
    { label: '按日统计', value: 2 },
    { label: '按时统计', value: 3 },
  ];
  optionsBar = {};
  dataX = [];
  dataS = [];
  dataF = [];
  dataT = [];
  dataBX = [];
  dataBS = [];


  isLoading = false;
  onEnterAfter(): void {

    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);
    setTimeout(() => {
      this.temp = true;
    });
    this.someTime = this.ifearm.timeForMat(365);
    this.querychannel();
    this.querytrans();
    this.radioChange();
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

      case 'infoQuery':
        console.log(result.bdy.data);
        this.trans = result.bdy.data;
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
  radioChange() {
    this.getCharts();
  }

  querytrans() {
    TransCommonApiHelper.conditionQuery(this, 'infoQuery', {
      tablename: 'btf_menu',
      page: '1',
      pagesize: '999'
    });
  }
  onMapInit(event) {
    this.mapIntance = event;
  }
  setBarChart(title) {
    this.optionsBar = {
      title: {
        text: title,
        x: 'center',
        textStyle: {
          fontWeight: "normal",
          color: "#fff"
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (argument) => {
          // tslint:disable-next-line: max-line-length
          return argument.name + '(' + argument.data.trans_code + ')' + '<br/>' + '成功：' + argument.data.succ_count + '<br/>' + '失败：' + argument.data.fail_count + '<br/>' + '总数：' + argument.value + '(' + argument.percent + '%)';
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: this.dataBX,
        textStyle: {
          fontSize: 16,
          color: '#00fdfe'
        }
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          data: this.dataBS,
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
  setChart(title) {
    this.optionsMap = {
      title: {
        text: title,
        textStyle: {
          fontWeight: "normal",
          color: "#fff"
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        x: 'right',
        data: ['成功', '失败', '总数'],
        textStyle: {
          fontSize: 16,
          color: '#fff'
        }
      },
      grid: {
        containLabel: true
      },

      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.dataX,
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
      series: [
        {
          name: '成功',
          type: 'line',

          data: this.dataS
        },
        {
          name: '失败',
          type: 'line',

          data: this.dataF
        },
        {
          name: '总数',
          type: 'line',
          data: this.dataT
        },

      ]
    };
    // this.mapIntance.setOption(this.optionsMap);
  }
  changeSelect() {
    this.getCharts();
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
    if (this.selectedValue.code === '' || this.selectedValue.code === undefined || this.selectedValue.code === null) {
      this.message.create('error', `CODE不能为空`);
      return;
    }
    const bdy = {
      type: this.selectedValue.type,
      code: this.selectedValue.code,
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
  getCharts() {
    const bdy = this.getRrason();
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.TRANSACTION,
      funccode: 'trendcount',
      svccode: 'TX400006',
      requestdata: {
        coh: {}, bdy: bdy
      }
    };
    this.dataX = [];
    this.dataS = [];
    this.dataF = [];
    this.dataT = [];
    this.dataBX = [];
    this.dataBS = [];
    this.isLoading = true;
    console.log(bdy);
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {

        data.resultdata.bdy.count.forEach(i => {
          this.dataX.push(i.axis);
          this.dataS.push(Number(i.succ_count));
          this.dataF.push(Number(i.fail_count));
          this.dataT.push(Number(i.total_count));
        });
        let name = '活期存款账户';
        this.trans.forEach(i => {
          if (bdy.code === i.menu_code) {
            name = i.menu_name;
          }
        });
        console.log(data);

        data.resultdata.bdy.ratio.forEach(i => {
          this.dataBX.push(i.trans_name);
          // tslint:disable-next-line: max-line-length
          this.dataBS.push({ value: Number(i.total_count), name: i.trans_name, succ_count: i.succ_count, fail_count: i.fail_count, trans_code: i.trans_code });
        });
        console.log(this.dataBX);

        this.setChart(name + '交易业务量趋势');
        this.setBarChart(name + '交易占比');
      }
    });
  }

}
