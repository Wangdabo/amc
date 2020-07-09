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
const transCode = 'tx990507';
const transName = '网点概览';
const exFuncCode = ['detail', 'queryfiled'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);

@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990507',
  templateUrl: './tx990507.component.html',
  styleUrls: ['./tx990507.component.css'],
})
export class Tx990507Component extends BaseTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>;
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{
    type: string
    transCode: string
    params: any
  }> = new EventEmitter();
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
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
  optionsAssets = {};
  optionsMap = {};
  optionsFinancial = {};
  styleDiv = {
    padding: '24px 0 0 0'
  };
  dict = {};
  queryObj = {};
  isChart = true;
  province = '';
  symbol = '1';
  mapdata = [  {name: '上海', value: 239},
  {name: '北京', value: 266},
  {name: '江苏', value: 993},
  {name: '广东', value: 1134},
  {name: '山东', value: 774},
  {name: '河北', value: 211},
  {name: '浙江', value: 276},
  {name: '福建', value: 92},
  {name: '辽宁', value: 363},
  {name: '安徽', value: 288},
  {name: '湖北', value: 517},
  {name: '四川', value: 490},
  {name: '陕西', value: 276},
  {name: '湖南', value: 490},
  {name: '山西', value: 227},
  {name: '贵州', value: 135},
  {name: '河南', value: 174},
  {name: '黑龙江', value: 188},
  {name: '吉林', value: 114},
  {name: '新疆', value: 168},
  {name: '甘肃', value: 160},
  {name: '云南', value: 149},
  {name: '内蒙古', value: 310},
  {name: '天津', value: 34},
  {name: '江西', value: 153},
  {name: '重庆', value: 40},
  {name: '广西', value: 50},
  {name: '宁夏', value: 67},
  {name: '海南', value: 92},
  {name: '青海', value: 45},
  {name: '西藏', value: 22},
  {name: '香港', value: 0},
  {name: '澳门', value: 0},
  {name: '台湾', value: 0},
  {name: '南海诸岛', value: 0}];
  queryModel = {
    data: [],
    condition: {
      pagesize: 0
    },
    totalCount: 0,
    isLoading: false,
    header: [
      {
        key: 'org_code',
        label: '网点号'
      },
      {
        key: 'org_name',
        label: '网点名称'
      },
      {
        key: 'service_tel',
        label: '电话',
      },
      {
        key: 'postcode',
        label: '邮编'
      },
      {
        key: 'org_addr',
        label: '地址'
      },
      {
        key: 'province',
        label: '省'
      },
      {
        key: 'city',
        label: '市'
      },
      {
        key: 'org_level',
        label: '网点等级'
      },
      {
        key: 'scope_business',
        label: '业务范围'
      },
      {
        key: 'create_time',
        label: '创建时间'
      },
      {
        key: 'housing_area',
        label: '场地面积'
      },
      {
        key: 'rank_score',
        label: '评分'
      },
      {
        key: 'moreClick',
        label: '更多画像',
        isclick: true
      }
    ],
  };
  optionsBankasset = {};
  optionsBankassetAdd = {};
  optionsIT = {};
  optionsIT1 = {};
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);
    setTimeout(() => {
      this.temp = true;
    });
    this.setMapChart();
    this.setAssetsChart();
    this.setFinancialChart();
    this.setBankassetChart();
    this.setItChart();
    this.setBankassetAddChart();
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
        const obj = result.bdy.data;
        let count;
        let province_count;
        let newdata;
        newdata = {};
        count = result.bdy.count.count;
        obj.forEach(element => {
          element = this.returnDict(element);
          element.moreClick = '详情';
        });
        console.log(obj);
        province_count = result.bdy.province_count;
        province_count.forEach(element => {
          newdata[element.province] = element.count;
        });
        this.mapdata.forEach(element => {
           const name = element.name;
           const value = newdata[name];
           if (value === undefined) {
               element.value = 0;
           } else {
               element.value = value;
           }
        });
        this.setMapChart();
        this.queryModel.isLoading = false;
        this.queryModel.data = obj;
        this.queryModel.totalCount = count;
        break;
      case 'queryfiled':
        this.dict = result.bdy.data;
        break;
     }
  }

  returnDict(data) {
    let i;
    for (i in data) {
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
          'scope_business', 'org_level', 'wire_level', 'business_type'
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
  setMapChart() {
    this.http.get('./assets/map/china.json')
      .subscribe(geoJson => {
        console.log(geoJson);
        echarts.registerMap('china', geoJson);
        this.optionsMap = {
          title: {
            text: '网点分布',
            subtext: 'Dot distribution',
            x: 'center',
            textStyle: {
              fontWeight: "normal",
              color: "#fff",
              marginRight: '20px'
            },
          },
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
          series: [
            {
              type: 'map',
              mapType: 'china',
              itemStyle: {
                normal: {
                  areaColor: '#C9E9F7',
                  label: { show: true }
                },
                emphasis: {
                  label: { show: true }
                }
              },
              zoom: 1.2,
              data: this.mapdata
            }
          ]
        };
      }
      );
  }
  setFinancialChart() {
    this.optionsFinancial = {
      title: {
        text: '财务指标',
        x: 'center',
        textStyle: {
          fontWeight: "normal",
          color: "#fff",
          marginRight: '20px'
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: '10',
        top: 30,
        textStyle: {
          fontSize: 16,
          color: '#fff'
        },
        data: ['非利息收入', '成本收入', '其他']
      },
      series: [
        {
          type: 'pie',
          radius: '30%',
          center: ['45%', '60%'],
          data: [
            { value: 335, name: '非利息收入' },
            { value: 310, name: '成本收入' },
            { value: 300, name: '其他' },
          ],
          label: {
            fontSize: 16
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
  setAssetsChart() {
    this.optionsAssets = {
      title: {
        text: '资产总额（万亿元）',
        x: 'center',
        textStyle: {
          fontWeight: "normal",
          color: "#fff",
          marginRight: '20px'
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: '10',
        top: 30,
        textStyle: {
          fontSize: 16,
          color: '#fff'
        },
        data: ['股东权益', '负债总额']
      },
      series: [
        {
          type: 'pie',
          radius: '35%',
          center: ['50%', '60%'],
          data: [
            { value: 335, name: '股东权益' },
            { value: 310, name: '负债总额' },
          ],
          label: {
            fontSize: 15
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

  setBankassetChart() {
    this.optionsBankasset = {
      title: {
        text: '银行资产价值',
        x: 'center',
        textStyle: {
          fontWeight: "normal",
          color: "#fff",
          marginRight: '20px'
        },
      },
      legend: {
        top: '8%',
        orient: 'horizontal',
        data: ['增长率', '营业额', '业务量', '客户数', '贷款率', '坏账率'],
        textStyle: {
          fontSize: 16,
          color: '#fff'
        }
      },
      series: [{
        type: 'pie',
        radius: ['14%', '24%'],
        center: ['30%', '34%'],
        name: '任务进度',
        avoidLabelOverlap: false,
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 20,
            name: '增长率',
            selected: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                fontSize: 16,
                formatter: '{d}%',
              }

            },
          },
          {
            value: 100,
            label: {
              normal: {
                show: false,

              }
            },
            itemStyle: {
              color: '#61a0a8'
            }
          },
        ]
      }, {
        type: 'pie',
        radius: ['14%', '24%'],
        center: ['70%', '34%'],
        name: '任务进度',
        avoidLabelOverlap: false,
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 20,
            name: '营业额',
            selected: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                fontSize: 16,
                formatter: '{d}%',
              }
            },
          },
          {
            value: 100,
            label: {
              normal: {
                show: false,
              }
            }
          },
        ]
      }, {
        type: 'pie',
        radius: ['14%', '24%'],
        center: ['30%', '60%'],
        name: '任务进度',
        avoidLabelOverlap: false,
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 20,
            name: '业务量',
            selected: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                fontSize: 16,
                formatter: '{d}%',
              }

            },

          },
          {
            value: 100,
            label: {
              normal: {
                show: false,

              }
            }

          },

        ]
      }, {
        type: 'pie',
        radius: ['14%', '24%'],
        center: ['70%', '60%'],
        encode: {
          itemName: 'product',
          value: '2015'
        },
        name: '任务进度',
        avoidLabelOverlap: false,
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 30,
            name: '客户数',
            selected: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                fontSize: 16,
                formatter: '{d}%',
              }
            },
          },
          {
            value: 100,
            label: {
              normal: {
                show: false,
              }
            }

          },

        ]
      }, {
        type: 'pie',
        radius: ['14%', '24%'],
        center: ['30%', '87%'],
        name: '任务进度',
        avoidLabelOverlap: false,
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 50,
            name: '贷款率',
            selected: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                fontSize: 16,
                formatter: '{d}%',
              }

            },

          },
          {
            value: 100,
            label: {
              normal: {
                show: false,

              }
            }

          },

        ]
      }, {
        type: 'pie',
        radius: ['14%', '24%'],
        center: ['70%', '87%'],
        encode: {
          itemName: 'product',
          value: '2015'
        },
        name: '任务进度',
        avoidLabelOverlap: false,
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 10,
            name: '坏账率',
            selected: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                fontSize: 16,
                formatter: '{d}%',
              }

            },

          },
          {
            value: 100,
            label: {
              normal: {
                show: false,

              }
            }

          },

        ]
      }]
    };


  }
  setBankassetAddChart() {
    this.optionsBankassetAdd = {
      title: {
        text: '银行资产新增数量',
        x: 'center',
        textStyle: {
          fontWeight: "normal",
          color: "#fff",
          marginRight: '20px'
        },
      },
      legend: {
        top: '8%',
        orient: 'horizontal',
        data: ['增长率', '营业额', '业务量', '客户数', '贷款率', '坏账率'],
        textStyle: {
          fontSize: 16,
          color: '#fff'
        }
      },
      series: [{
        type: 'pie',
        radius: ['14%', '24%'],
        center: ['30%', '34%'],
        name: '任务进度',
        avoidLabelOverlap: false,
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 20,
            name: '增长率',
            selected: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                fontSize: 16,
                formatter: '{d}%',
              }

            },
          },
          {
            value: 100,
            label: {
              normal: {
                show: false,

              }
            },
            itemStyle: {
              color: '#61a0a8'
            }
          },
        ]
      }, {
        type: 'pie',
        radius: ['14%', '24%'],
        center: ['70%', '34%'],
        name: '任务进度',
        avoidLabelOverlap: false,
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 20,
            name: '营业额',
            selected: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                fontSize: 16,
                formatter: '{d}%',
              }
            },
          },
          {
            value: 100,
            label: {
              normal: {
                show: false,
              }
            }
          },
        ]
      }, {
        type: 'pie',
        radius: ['14%', '24%'],
        center: ['30%', '60%'],
        name: '任务进度',
        avoidLabelOverlap: false,
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 20,
            name: '业务量',
            selected: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                fontSize: 16,
                formatter: '{d}%',
              }

            },

          },
          {
            value: 100,
            label: {
              normal: {
                show: false,

              }
            }

          },

        ]
      }, {
        type: 'pie',
        radius: ['14%', '24%'],
        center: ['70%', '60%'],
        encode: {
          itemName: 'product',
          value: '2015'
        },
        name: '任务进度',
        avoidLabelOverlap: false,
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 30,
            name: '客户数',
            selected: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                fontSize: 16,
                formatter: '{d}%',
              }
            },
          },
          {
            value: 100,
            label: {
              normal: {
                show: false,
              }
            }

          },

        ]
      }, {
        type: 'pie',
        radius: ['14%', '24%'],
        center: ['30%', '87%'],
        name: '任务进度',
        avoidLabelOverlap: false,
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 50,
            name: '贷款率',
            selected: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                fontSize: 16,
                formatter: '{d}%',
              }

            },

          },
          {
            value: 100,
            label: {
              normal: {
                show: false,

              }
            }

          },

        ]
      }, {
        type: 'pie',
        radius: ['14%', '24%'],
        center: ['70%', '87%'],
        encode: {
          itemName: 'product',
          value: '2015'
        },
        name: '任务进度',
        avoidLabelOverlap: false,
        hoverAnimation: false,
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 10,
            name: '坏账率',
            selected: false,
            label: {
              normal: {
                show: true,
                position: 'center',
                fontSize: 16,
                formatter: '{d}%',
              }

            },

          },
          {
            value: 100,
            label: {
              normal: {
                show: false,

              }
            }

          },

        ]
      }]
    };


  }
  setItChart() {
    this.optionsIT = {
      title: {
        text: '业绩发展趋势',
        left: 10,
        textStyle: {
          fontWeight: "normal",
          color: "#fff",
          marginRight: '20px'
        },
      },
      legend: {
        right: 10,
        textStyle: {
          fontSize: 16,
          color: '#00fdfe'
        }
      },
      tooltip: {},
      dataset: {
        dimensions: ['product', '总资产(亿元)', '总负债（亿元）', '所有者权益（亿元）'],
        source: [
          { product: '2015', '总资产(亿元)': 16.67, '总负债（亿元）': 15.36, '所有者权益（亿元）': 1.25 },
          { product: '2016', '总资产(亿元)': 17.60, '总负债（亿元）': 16.18, '所有者权益（亿元）': 1.35 },
          { product: '2017', '总资产(亿元)': 19.42, '总负债（亿元）': 17.86, '所有者权益（亿元）': 1.56 },
          { product: '2018', '总资产(亿元)': 20.93, '总负债（亿元）': 19.24, '所有者权益（亿元）': 1.69 },
        ]
      },
      xAxis: { type: 'category',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }},
      yAxis: {
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      series: [
        { type: 'bar' },
        { type: 'bar' },
        { type: 'bar' }
      ]
    };
    this.optionsIT1 = {
      title: {
        text: '财务指标占比趋势(%)',
        left: 10,
        textStyle: {
          fontWeight: "normal",
          color: "#fff"
        },
      },
      legend: {
        align: 'right',
        right: 10,
        textStyle: {
          fontSize: 16,
          color: '#00fdfe'
        }
      },
      tooltip: {},
      dataset: {
        dimensions: ['product', '总资产回报率', '净资产收益率', '非利息收入占比'],
        source: [
          { product: '2015', '总资产回报率': 1.05, '净资产收益率': 15.02, '非利息收入占比': 30.81 },
          { product: '2016', '总资产回报率': 1.15, '净资产收益率': 12.58, '非利息收入占比': 36.98 },
          { product: '2017', '总资产回报率': 1.10, '净资产收益率': 13.68, '非利息收入占比': 30.77 },
          { product: '2018', '总资产回报率': 1.16, '净资产收益率': 13.70, '非利息收入占比': 29.68 },
        ]
      },
      xAxis: {
        type: 'category',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      series: [
        { type: 'bar' },
        { type: 'bar' },
        { type: 'bar' }
      ]
    };
  }


  flagHandler(event) {
    console.log(event);
    if (event.queryObj !== undefined) {
      this.queryObj = event.queryObj;
    }
    this.symbol = event.symbol;
    this.getDict();
    const obj = {
      searchItems: this.queryObj,
      province: this.province,
      symbol: this.symbol,
      page: {
        CurrentPage: '1',
        Itemsperpage: '10'
      }
    };
    this.queryModel.isLoading = true;
    super.submit(
      'TX400004',
      'detail',
      'queryDetail',
      obj
    );

  }



  onChartClick($event) {
      console.log($event.data);
      this.isChart = !this.isChart;
      this.province = $event.data.name;
      this.queryModel.data = [];
      this.queryModel.totalCount = 0;
      this.getDict();
        const obj = {
          searchItems: this.queryObj,
          province: this.province,
          symbol: this.symbol,
          page: {
            CurrentPage: '1',
            Itemsperpage: '10'
          }
        };
        this.queryModel.isLoading = true;
        super.submit(
          'TX400004',
          'detail',
          'queryDetail',
          obj
        );
  }

  changeDiv() {
    this.isChart = !this.isChart;
    this.getDict();
    if (this.isChart) {
      this.queryModel.data = [];
      this.queryModel.totalCount = 0;
      this.province = '';
      const obj = {
        searchItems: this.queryObj,
        province: '',
        symbol: this.symbol,
        page: {
          CurrentPage: '1',
          Itemsperpage: '10'
        }
      };
      this.queryModel.isLoading = true;
      super.submit(
        'TX400004',
        'detail',
        'queryDetail',
        obj
      );
    } else {
      const obj = {
        searchItems: this.queryObj,
        province: '',
        symbol: this.symbol,
        page: {
          CurrentPage: '1',
          Itemsperpage: '10'
        }
      };
      this.queryModel.isLoading = true;
      super.submit(
        'TX400004',
        'detail',
        'queryDetail',
        obj
      );
    }
  }
  rowActiveHandler(event) {
    super.skipSonRoute('tx990508', {
      org_code: event.org_code,
      org_name: event.org_name,
      dict : this.dict
    });
  }

  pageChange(event) {
    console.log(event);
    const pageIndex = event.pageIndex;
    this.getDict();
    const obj = {
      searchItems: this.queryObj,
      province: this.province,
      symbol: this.symbol,
      page: {
        CurrentPage: pageIndex,
        Itemsperpage: '10'
      }
    };
    this.queryModel.isLoading = true;
    super.submit(
      'TX400004',
      'detail',
      'queryDetail',
      obj
    );

  }
}
