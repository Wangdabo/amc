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
import * as echarts from 'echarts';
const transCode = 'tx990503';
const transName = '客群画像';
const tableName = '';
const exFuncCode = ['detail', 'queryfiled'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};

@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990503',
  templateUrl: './tx990503.component.html',
  styleUrls: ['./tx990503.component.css'],
})
export class Tx990503Component extends BaseTransaction {
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
    private http: HttpClient
  ) {
    super(transCode);
  }
  theme: string;

  temp = false;
  queryModel = {
    data: [],
    condition: {
      pagesize: 0
    },
    totalCount: 0,
    isLoading: false,
    header: [
      {
        key: 'customer_name',
        label: '客户姓名'
      },
      {
        key: 'customer_tel',
        label: '手机号'
      },
      {
        key: 'sex',
        label: '性别',
      },
      {
        key: 'out_city_name',
        label: '城市归属'
      },
      {
        key: 'age',
        label: '年龄'
      },
      {
        key: 'cus_level',
        label: '客户等级'
      },
      {
        key: 'aum_amt_all',
        label: '收入（常规）'
      },
      {
        key: 'line_level',
        label: '风险偏好'
      },
      {
        key: 'cus_branch_name',
        label: '归属机构'
      },
      {
        key: 'cus_manager_name',
        label: '归属客户经理'
      },
      {
        key: 'moreClick',
        label: '更多画像',
        isclick: true
      },
      {
        key: 'strategyClick',
        label: '产品组合策略',
        isclick: true
      },
      {
        key: 'is_multiple',
        label: '预约'
      }
    ],
  };
  optionsMap = {};
  optionsAge = {};
  optionsAgeBin = {};
  optionsAssets = {};
  optionsGrade = {};
  optionsRisk = {};
  optionsRiskBin = {};
  isChart = true;
  // 性别比例
  gd = {};
  // 地域分布
  pd = [];
  // 年龄分布
  cd: any[] = [];
  // 风险偏好
  rg: any[] = [];
  // 资产分布
  aum: any[] = [];
  // 客户等级
  cl: any;
  queryObj = {};
  dict = {};
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);
    setTimeout(() => {
      this.temp = true;
    });
    this.getDict();
    this.setAgeChart();
    this.setMapChart();
    this.setAgeBinChart();
    this.setAssetsChart();
    this.setGradeChart();
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
      case 'detail':
        const obj = result.bdy.list;
        obj.forEach(element => {
          element = this.returnDict(element);
          element.moreClick = '详情';
          element.strategyClick = '详情';
        });
        console.log(obj);

        this.queryModel.isLoading = false;
        this.queryModel.data = obj;
        break;
      case 'queryfiled':
        this.dict = result.bdy.data;
        break;
    }
  }
  returnDict(data) {
    for (const i in data) {
      if (this.dict[i] !== undefined) {
        this.dict[i].forEach(element => {
          if (data[i] === element.tag_value) {
            data[i] = element.tag_name;
          }
        });
      }

    }
    return data;
  }
  getDict() {
    const secondObj = {
      searchItems: {
        parents: [
          'sex', 'cus_level', 'aum_amt_all', 'risk_grade'
        ]
      }
    };
    super.submit(
      'TX400002',
      'queryfiled',
      'queryByParents',
      secondObj
    );
  }

  flagHandler(event) {
    if (event.queryObj !== undefined) {
      this.queryObj = event.queryObj;
    }
    this.gd = event.gd[0];
    this.pd = [
      { name: '北京', value: '-' },
      { name: '天津', value: '-' },
      { name: '重庆', value: '-' },
      { name: '上海', value: '-' },
      { name: '湖南', value: '-' },
      { name: '广东', value: '-' },
      { name: '福建', value: '-' },
      { name: '江西', value: '-' },
      { name: '四川', value: '-' },
      { name: '广西', value: '-' },
      { name: '新疆', value: '-' },
      { name: '西藏', value: '-' },
      { name: '青海', value: '-' },
      { name: '甘肃', value: '-' },
      { name: '宁夏', value: '-' },
      { name: '内蒙古', value: '-' },
      { name: '海南', value: '-' },
      { name: '山西', value: '-' },
      { name: '陕西', value: '-' },
      { name: '云南', value: '-' },
      { name: '贵州', value: '-' },
      { name: '湖北', value: '-' },
      { name: '浙江', value: '-' },
      { name: '安徽', value: '-' },
      { name: '河南', value: '-' },
      { name: '山东', value: '-' },
      { name: '江苏', value: '-' },
      { name: '河北', value: '-' },
      { name: '辽宁', value: '-' },
      { name: '吉林', value: '-' },
      { name: '黑龙江', value: '-' },
      { name: '台湾', value: '-' },
      { name: '香港', value: '-' },
      { name: '澳门', value: '-' }
    ];
    event.pd.forEach(element => {
      this.pd.forEach(j => {
        if (element.NAME === j.name) {
          j.value = element.VALUE;
        }
      });
      // this.pd.push({ name: element.NAME, value: element.VALUE });


    });
    this.setMapChart();
    this.cd = [
      { name: '16岁以下', value: event.cd[0].AGE16 },
      { name: '16-22岁', value: event.cd[0].AGE16_22 },
      { name: '23-28岁', value: event.cd[0].AGE23_28 },
      { name: '29-34岁', value: event.cd[0].AGE29_34 },
      { name: '35-40岁', value: event.cd[0].AGE35_40 },
      { name: '41-49岁', value: event.cd[0].AGE41_49 },
      { name: '50-60岁', value: event.cd[0].AGE50_60 },
      { name: '60岁以上', value: event.cd[0].AGE60 },
    ];
    this.setAgeChart();
    this.setAgeBinChart();
    this.rg = [
      { name: '低风险', value: event.rg[0].LEVEL1 },
      { name: '较低风险', value: event.rg[0].LEVEL2 },
      { name: '中风险', value: event.rg[0].LEVEL3 },
      { name: '高风险', value: event.rg[0].LEVEL4 },
      { name: '极高风险', value: event.rg[0].LEVEL5 },
    ];
    this.setRiskChart();
    this.setRiskBinChart();
    this.aum = [
      { name: '0-1000', value: event.aum[0].AUMAMT0_1K },
      { name: '1000-5万', value: event.aum[0].AUMAMT1K_5W },
      { name: '5万-30万', value: event.aum[0].AUMAMT5W_30W },
      { name: '30万-50万', value: event.aum[0].AUMAMT30W_50W },
      { name: '50万-100万', value: event.aum[0].AUMAMT50W_100W },
      { name: '100万-500万', value: event.aum[0].AUMAMT100W_500W },
      { name: '500万以上', value: event.aum[0].AUMAMT100W_500W }
    ];
    this.setAssetsChart();
    this.cl = [
      { name: '中国理财客户', value: event.cl[0].ZHONGYIN },
      { name: '特殊财富客户', value: event.cl[0].TESHUCAIFU },
      { name: '私人银行客户', value: event.cl[0].SIREN },
      { name: '普通客户', value: event.cl[0].PUTONG },
      { name: '财富管理客户', value: event.cl[0].CAIFU },
      { name: '特殊理财客户', value: event.cl[0].TESHULICAI },
    ];
    this.setGradeChart();
  }
  setMapChart() {
    this.http.get('./assets/map/china.json')
      .subscribe(geoJson => {

        echarts.registerMap('china', geoJson);
        this.optionsMap = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}：{c}'
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {}
            }
          },
          visualMap: {
            min: 0,
            max: 50,
            text: ['高', '低'],
            realtime: false,
            calculable: true,
            inRange: {
              color: ['#f5eca4', '#c1484e']
            }
          },
          series: [
            {
              type: 'map',
              mapType: 'china',
              itemStyle: {
                normal: {
                  areaColor: '#eee',
                  label: { show: true }
                },
                emphasis: {
                  label: { show: true }
                }
              },
              zoom: 1.2,
              data: this.pd
            }
          ]
        };
      }
      );
  }
  setAgeBinChart() {
    this.optionsAgeBin = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          fontSize: 16,
          color: '#00fdfe'
        },
        data: ['16岁以下', '16-22岁', '23-28岁', '29-34岁', '35-40岁', '41-49岁', '50-60岁', '60岁以上']
      },
      series: [
        {
          name: '年龄分布',
          type: 'pie',
          radius: '75%',
          center: ['50%', '55%'],
          data: this.cd,
          label: {
            fontSize: 15
          },
          itemStyle: {
            emphasis: {
              label: {
                fontSize: 16
              },
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
  setAgeChart() {
    const obj = this.getValue(this.cd);
    this.optionsAge = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['年龄分布']
      },
      xAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        data: ['16岁以下', '16-22岁', '23-28岁', '29-34岁', '35-40岁', '41-49岁', '50-60岁', '60岁以上']
      },
      series: [
        {
          type: 'bar',
          data: obj
        }
      ]
    };
  }
  getValue(data) {
    let obj = [];
    data.forEach(element => {
      obj.push(element.value);
    });
    return obj;
  }
  setRiskChart() {
    const obj = this.getValue(this.rg);
    this.optionsRisk = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['风险偏好']
      },
      xAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        data: ['低风险', '较低风险', '中风险', '高风险', '极高风险']
      },
      series: [
        {
          type: 'bar',
          data: obj
        }
      ]
    };
  }
  setRiskBinChart() {
    this.optionsRiskBin = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          fontSize: 16,
          color: '#00fdfe'
        },
        data: ['低风险', '较低风险', '中风险', '高风险', '极高风险']
      },
      series: [
        {
          name: '风险偏好',
          type: 'pie',
          radius: '75%',
          center: ['50%', '55%'],
          data: this.rg,
          label: {
            fontSize: 15
          },
          itemStyle: {
            emphasis: {
              label: {
                fontSize: 16
              },
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }
  setAssetsChart() {
    const obj = this.getValue(this.aum);
    console.log(obj)
    this.optionsAssets = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        data: ['0-1000', '1000-5万', '5万-30万', '30万-50万', '50万-100万', '100万-500万', '500万以上']
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
        data: obj,
        type: 'line',
        areaStyle: {}
      }]
    };

  }
  setGradeChart() {
    this.optionsGrade = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 70,
        top: 10,
        textStyle: {
          fontSize: 18,
          color: '#00fdfe'
        },
        data: ['中国理财客户', '特殊财富客户', '私人银行客户', '普通客户', '财富管理客户', '特殊理财客户']
      },
      series: [
        {
          name: '客户等级',
          type: 'pie',
          radius: '85%',
          center: ['50%', '50%'],
          data: this.cl,
          label: {
            fontSize: 16
          },
          itemStyle: {
            emphasis: {
              label: {
                fontSize: 18
              },
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',

            }
          }
        }
      ]
    };
  }
  changeDiv() {
    this.isChart = !this.isChart;
    this.getDict();
    if (!this.isChart) {
      const obj = {
        searchItems: this.queryObj,
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

  }

  rowActiveHandler(event) {
    super.skipSonRoute('tx990504', {
      customer_name: event.customer_name,
      customer_tel: event.customer_tel,
    });
  }
}


