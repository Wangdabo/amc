
import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { IfearmService } from '../../../../service/ifearm.service';
import { BaseTransaction } from '../../base-transaction';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
const transCode = 'tx990530';
const transName = '运维中心';
const tableName = '';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990530',
  templateUrl: './tx990530.component.html',
  styleUrls: ['./tx990530.component.less']
})
export class Tx990530Component extends BaseTransaction {
  text: string;
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
  styleDiv = {
    padding: '24px 0 0 0',
    border: '3px solid #2570BE',
    borderRadius: '8px',
    margin: ' 2rem 0'
  };
  styleDivChart = {
    padding: '24px 0 0 0',
  };
  temp = false;
  optionsIT = {};
  optionsLine = {};
  topData = [
    { text: '日志中心', icon: 'anticon anticon-gold', index: 0 },
    { text: '微服务监控', icon: 'anticon anticon-line-chart', index: 1 },
    { text: '配置中心', icon: 'anticon anticon-robot', index: 2 },
    { text: '监控中心', icon: 'anticon anticon-cluster', index: 3 },
  ];
  centerData = [
    {
      icon: 'team',
      text: '客户累计量',
      value: '79',
      color: {
        backgroundColor: '#F05050'
      }
    },
    {
      icon: 'notification', text: '累计营销活动', value: '30',
      color: {
        backgroundColor: '#7266ba'
      }
    },
    {
      icon: 'project', text: '累计营销项目', value: '179',
      color: {
        backgroundColor: '#18bc9c'
      }
    },
    {
      icon: 'pic-right', text: '自定义营销策略', value: '29',
      color: {
        backgroundColor: '#61a0a8'
      }
    }
  ];
  gridStyle = {
    width: '25%',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '18px'
  };
  constructor(public ifearm: IfearmService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer
  ) {
    super(transCode);
  }

  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);

    this.text = '欢迎进入AMC运维中心';
    setTimeout(() => {
      this.temp = true;
    });
    this.setItChart();
    this.setLineChart();


  }
  listDataCallback(data: any): void {
  }

  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {

  }

  setLineChart() {
    this.optionsLine = {
      title: {
        text: '客户数量变化趋势图',
        subtext: 'Trend Chart of Customer Quantity Change'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        type: 'line'
      }]
    };
  }
  setItChart() {
    this.optionsIT = {
      title: {
        text: '活跃人数变化图',
        subtext: 'Debit Card Active Number Change Chart'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['活跃', '非活跃']
      },
      toolbox: {
        show: true,
        feature: {

          magicType: { show: true, type: ['line', 'bar'] },

        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '活跃',
          type: 'bar',
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        },
        {
          name: '非活跃',
          type: 'bar',
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          markPoint: {
            data: [
              { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
              { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }
      ]
    };
  }
  cardClick(event) {
    console.log(event);
    switch (event.index) {
      case 0:
        super.skipSonRoute('tx990513');
        break;
      case 1:
        super.skipSonRoute('tx990514');
        break;
      case 2:
        super.skipSonRoute('tx990515');
        break;
      default:
          super.skipSonRoute('tx990529');
        break;
    }
  }

}
