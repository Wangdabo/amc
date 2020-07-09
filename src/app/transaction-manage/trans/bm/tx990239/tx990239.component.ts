import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { TransCommonApiHelper } from '../../trans-common-api-helper';
import { IfearmService } from '../../../../service/ifearm.service';
import {HttpHeaders} from "@angular/common/http";
import {Http} from "@angular/http";

const transCode = 'tx990239';
const transName = '交易监控';
const tableName = 'BTF_TRANS_JNL';
const exFuncCode = ['queryData', 'queryCode'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [{
    key: 'trans_state', label: '交易状态', dictId: 'SMQ_TRANS_STATE'
  }, {
    key: 'trans_date', label: '登记时间'
  }, {
    key: 'teller_code', label: '交易柜员',
  }, {
    key: 'err_code', label: '错误代码',
  }, {
    key: 'org_code', label: '交易网点'
  }, {
    key: 'trans_serial_no', label: '交易流水号'
  }],
  queryHeader: [],
  tableName: tableName

};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options
})
@Component({
  selector: 'app-tx990239',
  templateUrl: './tx990239.component.html',
  styleUrls: ['./tx990239.component.css']
})
export class Tx990239Component extends CrudTransaction implements OnDestroy {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb')
  transactionContextChangeOb: Observable<{ tcFuncCode: string, transactionContext: TransactionContext }>;
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{ type: string, transCode: string, params: any }> = new EventEmitter();
  @Output('submitEvent')
  submitEvent: EventEmitter<{ svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }> = new EventEmitter();
  tochildinfo: any;
  img = this.ifearm.imgSrc;

  constructor(public settingService: SettingService,
    private ifearm: IfearmService,
    private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
  }
  theme: string;
  isShow = false;
  temp = false;
  divCards = [];

  radios = [];
  interval: any;
  optionsTrading = {};
  optionsGrid = {};
  resultData: {
    global_count: {
      total_trans: 0,
      suuc_rate: 0,
      sec_trans: 0,
      hour_detail: any
    },
    type_count: any,
    channel_count: any
  };
  radioValue = 'all';
  dict = {};
  gridStyle = {
    width: '100%',
    textAlign: 'center',
    marginBottom: '16px'
  };
  hours = [];
  returnmessage: string;
  monitorid: string;
  topSelects = [];
  flage = false;
  percent = 100;
  optionsCards = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', ' 50%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: true,
            position: 'center',
            formatter: function (argument) {
              let html;
              html = '0%';
              return html;
            },
            textStyle: {
              fontSize: 18,
              color: 'black'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [{
          value: [],
          name: '成功',
          itemStyle: {
            color: '#52c41a'
          }
        },
        {
          value: [],
          name: '失败',
          itemStyle: {
            color: '#c23531'
          }
        }]
      }
    ]
  };
  declineTime: any;
  second = 0;
  secondSave = 0;
  formatOne = () => `${this.second}S`;
  onEnterAfter(): void {
    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb,
      submitEvent: this.submitEvent,
      baseForm: this.baseForm,
      notification: this.notification, modelService: this.modelService, sonRouteEvent: this.sonRouteEvent
    });
    this.setTime();
    this.queryModel.topActions = [];
    setTimeout(() => {
      this.temp = true;
    });
    // this.isShow = true;
    this.getCode();
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
    switch (tcFuncCode) {

      case 'queryData':
        if (result.returncode === '000000') {
          this.percent = 100;
          this.second = this.secondSave;
          this.decline();
          this.resultData = result.resultdata.bdy;

          this.setLineChart();
          console.log(result);

          this.isShow = true;
          let radios; radios = [];
          // tslint:disable-next-line: forin
          for (let i in this.resultData.channel_count) {
            let obj;
            if (i === 'all') {
              obj = {
                key: i,
                label: '全部渠道'
              };
            } else {
              obj = {
                key: i,
                label: this.resultData.channel_count[i][0]['channel_name']
              };
            }
            radios.push(obj);
          };
          const A = JSON.stringify(radios);
          const B = JSON.stringify(this.radios);
          if (A !== B) {
            this.radios = radios;
          }
          const arr = [];

          this.setPieChart(this.resultData.channel_count['all']);
          this.divCards = this.resultData.type_count;
          this.resultData.type_count.forEach(element => {
            element.optionsGrid = this.setChart(element);
          });
        } else {
          this.returnmessage = result.returnmessage;
          this.isShow = false;
        }

        break;
      case 'queryCode':
        this.topSelects = result.resultdata.bdy.data;
        this.monitorid = this.topSelects[0].id;
        this.ngModelChange(this.monitorid);
        this.getData();
        break;
    }
  }
  decline(): void {
    this.declineTime = setInterval(() => {
      const num = 100 / Number(this.secondSave);
      this.second = this.second - 1;
      this.percent = this.percent - Math.floor(num);

      // if (this.second === 1) {
      //   this.percent = 0;
      // } else {
      //   this.percent = this.percent - Math.floor(num);
      // }

    }, 1000);
  }
  setString(dataStr) {
    const peopleArr = dataStr.split(',');
    let objArr;
    objArr = [];
    peopleArr.forEach(i => {
      const str = i.toString().split(':');
      if (str[0] === 'alarmTimeE' || str[0] === 'alarmTimeB') {
        objArr.push({ filed: str[0], value: str[1] + ':' + str[2] + ':' + str[3] });
      } else if (str[0] === 'data') {
        objArr.push({ filed: str[0], value: str[1].split('-') });
      } else {
        objArr.push({ filed: str[0], value: str[1] });
      }
    });
    return objArr;
  }
  onAddActionBefore(): void {
  }

  ngModelChange(event) {
    let obj;
    this.topSelects.forEach(i => {
      if (i.id === event) {
        obj = i;
      }
    });
    this.stopHttp();
    const objStr = this.setString(obj.config_detail);
    objStr.forEach(element => {
      if (element.filed === 'refreshInterval') {
        this.secondSave = element.value - 1;
        this.second = this.secondSave;
        this.setIntervalFun(element.value);
      }
    });

  }
  setIntervalFun(time) {

    const times = time * 1000;
    this.interval = setInterval(() => {
      this.getData();
      super.query();
    }, times);
  }

  rowActiveHandler($event) {

  }
  changeRadio(event) {
    this.setPieChart(this.resultData.channel_count[event]);
  }
  setTime() {
    const myDate = new Date();
    this.hours = [];
    const nowHour = myDate.getHours();
    for (let i = 0; i <= nowHour; i++) {

      let ti = i.toString();
      if (i < 10) {
        ti = '0' + ti;
      }
      this.hours.push({ time: ti, succ_count: '0', total_count: '0' });
    }
  }
  getData() {
    clearInterval(this.declineTime);
    super.submit('TX400006', 'queryData', 'refresh', { monitorid: this.monitorid });
  }

  getCode() {
    TransCommonApiHelper.conditionQuery(this, 'queryCode', {
      tablename: 'btf_trans_monitor_config',
      page: '1',
      pagesize: '999'
    });
  }
  setLineChart() {
    const dataX = [];
    const dataV1 = [];
    const dataV2 = [];
    this.resultData.global_count.hour_detail.forEach(element => {
      this.hours.forEach(i => {
        if (i.time === element.hours) {
          i.succ_count = element.succ_count;
          i.total_count = element.total_count;
        }
      });
    });
    this.hours.forEach(i => {
      dataX.push(i.time + ':00');
      dataV1.push(i.succ_count);
      dataV2.push(i.total_count);
    });


    this.optionsTrading = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        textStyle: {
          fontSize: 14,
          color: '#fff'
        },
        data: ['当前时间交易成功数', '当前时间交易总数']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: dataX,
          axisLabel: {
            fontSize: 14,
            color: '#fff'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            fontSize: 14,
            color: '#fff'
          }
        }
      ],
      series: [
        {
          name: '当前时间交易成功数',
          type: 'line',
          color: '#91c7ae',
          areaStyle: {},
          data: dataV1,
          smooth: true
        },
        {
          name: '当前时间交易总数',
          type: 'line',
          areaStyle: {},
          color: '#c23531',
          data: dataV2,
          smooth: true
        }
      ]
    };


  }
  setChart(arr) {
    const obj = [
      {
        value: arr.succ_count,
        name: '成功',
        itemStyle: {
          color: '#52c41a'
        }
      },
      {
        value: arr.fail_count,
        name: '失败',
        itemStyle: {
          color: '#c23531'
        }
      }
    ];
    const optionsGrid = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', ' 50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: function (argument) {
                let html;
                html = parseFloat((arr.succ_rate * 100).toString()) + '%';
                return html;
              },
              textStyle: {
                fontSize: 18,
                color: '#00fdfe'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            },
            textStyle: {
              fontSize: 18,
              color: '#00fdfe'
            }
          },
          data: obj
        }
      ]
    };
    return optionsGrid;
  }



  setPieChart(arr) {
    console.log(arr);
    if (!arr) {
      arr = [];
    }

    const obj = [];
    const name = [];
    let sum;
    sum = 0;
    console.log(arr);

    arr.forEach(element => {
      sum += parseInt(element.sum);
      obj.push({ value: element.sum, name: element.menu_name });
      name.push(element.menu_name);
    });
    this.optionsGrid = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 30,
        top: 30,
        textStyle: {
          fontSize: 14,
          color: '#fff'
        },
        data: name
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', ' 50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: function (argument) {
                let html;
                html = '交易总笔数\r\n\r\n' + sum + '单';
                return html;
              },
              textStyle: {
                fontSize: 18,
                color: '#fff'
              }
            }
          },
          labelLine: {
            normal: {
              show: false,
              textStyle: {
                fontSize: 18,
                color: '#fff'
              }
            }
          },
          data: obj
        }
      ]
    };
  }
  rowActionsHandler($event) {
    super.rowActionsHandler($event);
  }
  goConfig() {
    this.stopHttp();

    super.skipSonRoute('tx990240', { id: this.monitorid });
  }
  ngOnDestroy() {
    this.stopHttp();

  }
  stopHttp() {
    clearInterval(this.declineTime);
    clearInterval(this.interval);

  }
}


