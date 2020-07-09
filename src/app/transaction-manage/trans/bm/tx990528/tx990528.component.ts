import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
const transCode = 'tx990528';
const transName = '操作行为分析';
const tableName = '';
const exFuncCode = ['detail'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990528',
  templateUrl: './tx990528.component.html',
  styleUrls: ['./tx990528.component.css']
})
export class Tx990528Component extends BaseTransaction {
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
  SelectedIndex = 0;
  queryModel = {
    data: [
      { customer_name: 'kkk', customer_tel: 's' },
      { customer_name: 'kkk', customer_tel: 's' },
    ],
    condition: {
      pagesize: 0
    },
    totalCount: 0,
    isLoading: false,
    rowActions: [{ key: 'detail', label: '详情' }, { key: 'upd', label: '修改' }, { key: 'del', label: '删除' }],
    header: [
      {
        key: 'customer_name',
        label: '客户姓名'
      },
      {
        key: 'customer_tel',
        label: '手机号'
      }
    ],
  };
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
  tabs = [
    { title: '操作时长分析', index: 0 },
    { title: '操作行为分析', index: 1 }
  ];
  optionsTransaction = {};
  option = {};
  isLoading = false;
  mapIntance: any;
  temp = false;
  constructor(public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient
  ) {
    super(transCode);
  }
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    setTimeout(() => {
      this.temp = true;
      this.setTransaction('全部渠道前' + this.selectedValue.rank + '时长分析');
    });



    this.changTab(0);
  }
  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    ).resultdata;
    switch (tcFuncCode) {
      case 'detail':
        this.queryModel.isLoading = false;
        this.queryModel.data = [];
        break;
    }
  }
  getData() {
    const obj = {
      searchItems: '',
      symbol: '1',
      page: {
        CurrentPage: '1',
        Itemsperpage: '10'
      }
    };
    this.queryModel.isLoading = true;

    super.submit(
      'TX400001',
      'detail',
      'queryDetail',
      obj
    );
  }

  changTab(event) {
    console.log(event);

  }
  setTransaction(title) {
    this.optionsTransaction = {
      backgroundColor: '#2c343c',

      title: {
        text: 'Customized Pie',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc'
        }
      },

      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },

      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 274, name: '联盟广告' },
            { value: 235, name: '视频广告' },
            { value: 400, name: '搜索引擎' }
          ].sort(function (a, b) { return a.value - b.value; }),
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {
            normal: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    };
    this.isLoading = false;
    this.mapIntance.setOption(this.optionsTransaction);
  }
  onMapInit(event) {
    this.mapIntance = event;
  }
  setoption() {
    this.option = {
      dataset: {
        source: [
          ['score', 'amount', 'product'],
          [89.3, 58212, 'Matcha Latte'],
          [57.1, 78254, 'Milk Tea'],
          [74.4, 41032, 'Cheese Cocoa'],
          [50.1, 12755, 'Cheese Brownie'],
          [89.7, 20145, 'Matcha Cocoa'],
          [68.1, 79146, 'Tea'],
          [19.6, 91852, 'Orange Juice'],
          [10.6, 101852, 'Lemon Juice'],
          [32.7, 20112, 'Walnut Brownie']
        ]
      },
      grid: { containLabel: true },
      xAxis: { name: 'amount' },
      yAxis: { type: 'category' },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: 10,
        max: 100,
        text: ['High Score', 'Low Score'],
        // Map the score column to color
        dimension: 0,
        inRange: {
          color: ['#D7DA8B', '#E15457']
        }
      },
      series: [
        {
          type: 'bar',
          encode: {
            // Map the "amount" column to X axis.
            x: 'amount',
            // Map the "product" column to Y axis
            y: 'product'
          }
        }
      ]
    };
  }
  chartClick(event) {
    console.log(event);
    this.setoption();
  }
}

