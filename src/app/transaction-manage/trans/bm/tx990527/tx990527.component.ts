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
import { TransCommonApiHelper } from '../../trans-common-api-helper';
import * as echarts from 'echarts';

const transCode = 'tx990527';
const transName = '交易行为分析';
const tableName = '';
const exFuncCode = ['getglobal', 'queryCode', 'timeCount', 'transList', 'sourceTarget', 'transDetail', 'areaCount', 'viewList'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990527',
  templateUrl: './tx990527.component.html',
  styleUrls: ['./tx990527.component.css']
})
export class Tx990527Component extends BaseTransaction {
  @ViewChild('baseForm', { static: true })
  baseForm: FormComponent;
  // tslint:disable-next-line: no-input-rename
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
  SelectedIndex: number;
  txcodes = [
    { label: '卡激活', value: 'TX010509' },
    { label: '转帐', value: 'TX010508' },
  ]
  queryModel = {
    data: [

    ],
    condition: {
      pagesize: 0
    },
    totalCount: 0,
    isLoading: false,
    rowActions: [],
    isShowFieldName: true,
    header: [
      {
        key: 'trans_serial_no',
        label: '交易流水号'
      },
      {
        key: 'teller_code',
        label: '柜员号'
      },
      {
        key: 'org_code',
        label: '机构号'
      },
      {
        key: 'workstation_code',
        label: '工作站代码'
      }
    ],
  };
  selectedValue = {
    rank: 50,
    type: 3,
    txcode: null,
    channel: null,
    name: '',
    view: null,
  };
  optionsMap = {};
  clickTabIndex = 0;
  typeTime = [
    { label: '按年统计', value: 3 },
    { label: '按月统计', value: 2 },
    { label: '按日统计', value: 1 },
    { label: '按时统计', value: 0 },
  ];
  tabs = [
    { title: '操作时长分析', index: 0 },
    { title: '操作行为分析', index: 1 },
    { title: '用户地域分布', index: 2 },
    { title: '页面来源去向', index: 3 },
  ];
  data = [
    { title: '账户限额查询', value: 5 },
    { title: '现金池子账户参数查询', value: 5.6 },
    { title: '账户累计金额查询', value: 6 },
    { title: '资金池支付异常失败指令查询', value: 7 },
    { title: '资金池支付异常失败指令查询', value: 8 },
    { title: '现金池归集下拨明细查询', value: 10 },
    { title: '本票汇票签发', value: 11 },
    { title: '本票汇票换开交易', value: 11 },
    { title: '华东三省一市银行汇票行内兑付', value: 12 },
    { title: '本、汇票信息库查询', value: 16 },
    { title: '银行汇票/查复书密押核押查询', value: 20 },
    { title: '圈存支票解除', value: 21.6 },
    { title: '圈存支票查询', value: 25 },
    { title: '转账', value: 27 },
    { title: '额度不足退票', value: 30 },
    { title: '单一帐户退回', value: 31 },
    { title: '额度注销', value: 32 },
    { title: '系统签到', value: 34 },
    { title: '人行来账异常情况信息查询', value: 35 },
    { title: '发送退库退回通知', value: 40 },
    { title: '查询入账通知明细', value: 46 },
    { title: '退回清算查询', value: 47 },
    { title: '生成退票凭证', value: 48 },
    { title: '公务卡还款凭证打印', value: 49 },
    { title: '授权支付申请清算表', value: 50 },
    { title: '直接支付文件确认', value: 52 },
    { title: '直接支付文件确认', value: 55 },
    { title: '无纸化拨款文件查询', value: 60 },
    { title: '无纸化拨款文件确认', value: 70 },
    { title: '系统状态查询', value: 88 },
  ]
  optionsTransaction = {};
  option = {};
  optionsFunnel = {};
  isLoading = false;
  mapIntance: any;
  temp = false;
  isChart = true;
  drawerdata: any;
  obj: any;
  global_count = {
    app_startup: {
      'yesterday': '--',
      'today': '--',
      'change': '--'
    },
    user_active: {
      'yesterday': '--',
      'today': '--',
      'change': '--'
    },
    startup_speed: []
  };
  optionsStartup = {
    title: {
      text: '某站点用户访问来源',
      subtext: '纯属虚构',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
    },
    series: [
      {
        name: '访问来源',
        type: 'pie',
        radius: '55%',
        center: ['50%', '60%'],
        data: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 234, name: '联盟广告' },
          { value: 135, name: '视频广告' },
          { value: 1548, name: '搜索引擎' }
        ],
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
  mapdata = [{ name: '上海', value: 239 },
  { name: '北京', value: 266 },
  { name: '江苏', value: 993 },
  { name: '广东', value: 1134 },
  { name: '山东', value: 774 },
  { name: '河北', value: 211 },
  { name: '浙江', value: 276 },
  { name: '福建', value: 92 },
  { name: '辽宁', value: 363 },
  { name: '安徽', value: 288 },
  { name: '湖北', value: 517 },
  { name: '四川', value: 490 },
  { name: '陕西', value: 276 },
  { name: '湖南', value: 490 },
  { name: '山西', value: 227 },
  { name: '贵州', value: 135 },
  { name: '河南', value: 174 },
  { name: '黑龙江', value: 188 },
  { name: '吉林', value: 114 },
  { name: '新疆', value: 168 },
  { name: '甘肃', value: 160 },
  { name: '云南', value: 149 },
  { name: '内蒙古', value: 310 },
  { name: '天津', value: 34 },
  { name: '江西', value: 153 },
  { name: '重庆', value: 40 },
  { name: '广西', value: 50 },
  { name: '宁夏', value: 67 },
  { name: '海南', value: 92 },
  { name: '青海', value: 45 },
  { name: '西藏', value: 22 },
  { name: '香港', value: 0 },
  { name: '澳门', value: 0 },
  { name: '台湾', value: 0 },
  { name: '南海诸岛', value: 0 }];
  piedata: any;
  transList: any;
  transDetail: any;
  optionssankeyCome = {};
  optionssankeyGo = {};
  optionsstart = {};
  viewLists: any;
  sourceTarget: any;
  constructor(public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient
  ) {
    super(transCode);
  }
  onEnterAfter(): void {
    this.SelectedIndex = 0;
    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    // this.queryModel.rowActions[2] = { key: 'look', label: '查看' };


    this.changTab(0);
    this.getglobal();
    this.time_count();
    this.trans_list();
  }
  getCode() {
    this.queryModel.isLoading = true;
    TransCommonApiHelper.conditionQuery(this, 'queryCode', {
      tablename: 'btf_trans_jnl',
      page: '1',
      pagesize: '20',
      params: [{
        'logic': 'AND',
        'queryList': [{
          'logic': 'AND',
          'operator': 'EQ',
          'params': ['trans_code', this.selectedValue.txcode]
        }]
      }]
    });
  }
  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    );
    switch (tcFuncCode) {
      case 'queryCode':
        this.queryModel.isLoading = false;
        this.queryModel.data = result.resultdata.bdy.data;
        break;
      case 'getglobal':
        this.global_count = result.resultdata.bdy.global_count;
        const objs = [
          { value: 200, name: '<1s' },
          { value: 500, name: '1-3s' },
          { value: 250, name: '3-5s' },
          { value: 235, name: '>5s' },
        ];
        this.setoptionsstart(objs);
        break;
      case 'timeCount':
        // this.piedata = result.resultdata.bdy.count.trans_detail;
        this.piedata = [
          [
            {
              avg_time: '9.8269',
              trans_code: 'tx030005',
              trans_name: '客户信息修改'
            },
            {
              avg_time: '8.8269',
              trans_code: 'tx030005',
              trans_name: '卡激活'
            },
            {
              avg_time: '7.8269',
              trans_code: 'pd000502',
              trans_name: '签约申请'
            },
            {
              avg_time: '6.8269',
              trans_code: 'tx300001',
              trans_name: '智能体检'
            },
            {
              avg_time: '8.9',
              trans_code: 'tx200006',
              trans_name: ' 开卡'
            }
          ],
          [
            {
              avg_time: '11.8269',
              trans_code: 'tx030006',
              trans_name: '客户信息修改2'
            },
            {
              avg_time: '10.8269',
              trans_code: 'tx030004',
              trans_name: '业务办理箱'
            }, {
              avg_time: '11.8269',
              trans_code: 'tx030006',
              trans_name: '活期账户转账'
            },
            {
              avg_time: '10.8269',
              trans_code: 'tx030004',
              trans_name: '签约申请'
            },
            {
              avg_time: '10.8269',
              trans_code: 'tx030004',
              trans_name: '签约变更'
            }
          ],
          [
            {
              avg_time: '21.8269',
              trans_code: 'tx030001',
              trans_name: '出库'
            },
            {
              avg_time: '22.8269',
              trans_code: 'tx030003',
              trans_name: '入库'
            }, {
              avg_time: '21.8269',
              trans_code: 'tx030001',
              trans_name: '账户限额查询'
            },
            {
              avg_time: '22.8269',
              trans_code: 'tx030003',
              trans_name: ' 账户累计金额查询'
            },
            {
              avg_time: '22.8269',
              trans_code: 'tx030003',
              trans_name: '  本票汇票签发'
            }
          ],
          [
            {
              avg_time: '31.8269',
              trans_code: 'TSS000001',
              trans_name: '圈存支票解除'
            }, {
              avg_time: '31.8269',
              trans_code: 'TSS000001',
              trans_name: '圈存支票查询'
            }, {
              avg_time: '31.8269',
              trans_code: 'TSS000001',
              trans_name: '转账'
            }, {
              avg_time: '31.8269',
              trans_code: 'TSS000001',
              trans_name: '单一帐户退回'
            }, {
              avg_time: '31.8269',
              trans_code: 'TSS000001',
              trans_name: '额度注销'
            }
          ],
          [
            {
              avg_time: '47',
              trans_code: 'TSS000001',
              trans_name: '系统签到'
            }, {
              avg_time: '46',
              trans_code: 'TSS000001',
              trans_name: '系统签退'
            }, {
              avg_time: '43',
              trans_code: 'TSS000001',
              trans_name: '批量报备'
            }, {
              avg_time: '43',
              trans_code: 'TSS000001',
              trans_name: '手工上传报文'
            }, {
              avg_time: '42',
              trans_code: 'TSS000001',
              trans_name: ' 公务卡退回'
            }
          ],
          [
            {
              avg_time: '67',
              trans_code: 'TSS000001',
              trans_name: '手工下载报文'
            }, {
              avg_time: '66',
              trans_code: 'TSS000001',
              trans_name: '垫付资金基础调整'
            }, {
              avg_time: '63',
              trans_code: 'TSS000001',
              trans_name: '垫付资金查询'
            }, {
              avg_time: '53',
              trans_code: 'TSS000001',
              trans_name: '额度对账查询'
            }, {
              avg_time: '52',
              trans_code: 'TSS000001',
              trans_name: '生成回盘文件'
            }
          ]
        ];
        const obj = [
          { value: 200, name: '0-10s', index: 0 },
          { value: 500, name: '10-20s', index: 1 },
          { value: 250, name: '20-30s', index: 2 },
          { value: 235, name: '30-40s', index: 3 },
          { value: 400, name: '40-50s', index: 4 },
          { value: 400, name: '50s以上', index: 5 }
        ];
        console.log(obj);
        // obj.forEach((element, index) => {
        //   obj[index]['value'] = this.piedata[index].length;
        // });
        this.setTransaction(obj);
        break;
      case 'transList':
        console.log(result.resultdata.bdy);
        this.transList = result.resultdata.bdy.trans_list;
        break;
      case 'transDetail':
        console.log(result.resultdata.bdy);
        this.transDetail = result.resultdata.bdy;
        this.queryModel.data = this.transDetail.trans_jnl_list;
        this.transDetail.trans_bhv_live_rate.forEach(element => {
          element.value = Number(element.value);
        });
        console.log(this.transDetail);
        this.setFunnel(this.transDetail.trans_bhv_live_rate);
        break;
      case 'areaCount':
        console.log(result.resultdata.bdy.area_count.detail);

        this.setMapChart(this.mapdata);

        break;
      case 'viewList':
        this.viewLists = result.resultdata.bdy.view_list;

        break;
      case 'sourceTarget':
        console.log(result.resultdata.bdy);
        this.sourceTarget = result.resultdata.bdy;
        this.setConmeGo(this.sourceTarget.source_target);
        break;

    }

  }
  getglobal() {
    super.submit(
      'TX400007',
      'getglobal',
      'global',
      {}
    );
  }
  time_count() {
    super.submit(
      'TX400007',
      'timeCount',
      'time_count',
      {}
    );
  }
  area_count() {
    super.submit(
      'TX400007',
      'areaCount',
      'area_count',
      {}
    );
  }
  trans_list() {
    super.submit(
      'TX400007',
      'transList',
      'trans_list',
      {}
    );
  }
  trans_detail(code) {
    super.submit(
      'TX400007',
      'transDetail',
      'trans_detail',
      {
        trans_code: code
      }
    );
  }
  view_list() {
    super.submit(
      'TX400007',
      'viewList',
      'view_list',
      {
      }
    );
  }
  changTab(event) {
    this.selectedValue.txcode = null;
    if (event === 1) {

    }

  }
  setoptionsstart(data) {
    console.log(data);
    this.optionsstart = {
      title: {
        text: '启动时间占比',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#fff'
        }
      },

      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '70%',
          center: ['50%', '60%'],
          data: data.sort(function (a, b) { return a.value - b.value; }),
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: '#fff'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
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
  }
  setTransaction(data) {
    console.log(data);

    console.log(data);

    this.optionsTransaction = {
      title: {
        text: '交易时长占比',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#fff'
        }
      },

      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '70%',
          center: ['50%', '60%'],
          data: data.sort(function (a, b) { return a.value - b.value; }),
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: '#fff'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
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
  setFunnel(data) {
    const obj = [];
    data.forEach(element => {
      obj.push(element.value);
    });
    const max = Math.max(...obj);

    data.forEach(element => {
      element.value = ((element.value / max) * 100).toFixed(2);
    });
    console.log(data);

    this.optionsFunnel = {
      title: {
        text: '操作行为分析',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
      },
      calculable: true,
      series: [
        {
          name: '操作行为',
          type: 'funnel',
          left: '10%',
          top: 60,
          // x2: 80,
          bottom: 60,
          width: '80%',
          // height: {totalHeight} - y - y2,

          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
            fontSize: 19
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          emphasis: {
            label: {
              fontSize: 22
            }
          },
          data: data
        }
      ]
    };
  }
  onMapInit(event) {
    this.mapIntance = event;
  }
  setoption(title, data) {

    let x;
    if (title !== '50s以上') {
      x = title.split('-');
    } else {
      x = [title, '无穷大'];
    }
    this.option = {
      title: {
        text: title + ' 交易TOP 5',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#fff'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      dataset: {
        source: data
      },
      grid: { containLabel: true },
      xAxis: {
        name: '笔数', axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      yAxis: {
        type: 'category', axisLine: {
          lineStyle: {
            color: '#fff'
          }
        }
      },
      visualMap: {
        orient: 'horizontal',
        left: 'center',
        min: 0,
        max: 100,
        text: x.reverse(),
        // Map the score column to color
        textStyle: {
          color: '#fff'
        },
        dimension: 0,
        inRange: {
          color: ['#D7DA8B', '#E15457']
        }
      },
      series: [
        {
          type: 'bar',
          encode: {
            // Map the 'amount' column to X axis.
            x: 'amount',
            // Map the 'product' column to Y axis
            y: 'product'
          }
        }
      ]
    };
  }
  setMapChart(data) {
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
            textStyle: {
              color: '#fff',
            },
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
              data: data
            }
          ]
        };
      }
      );

  }
  setConmeGo(data) {
    let obj = [];
    let objArr = [];
    data.forEach(element => {
      obj.push(element.source);
      obj.push(element.target);
      element.value = Number(element.value)
      element.lineStyle = {
        color: '#00b4cd'
      }
    });
    obj = Array.from(new Set(obj));
    obj.forEach(element => {
      objArr.push({ name: element });
    });
    console.log(JSON.stringify(objArr));
    console.log(JSON.stringify(data));

    this.optionssankeyCome = {
      tooltip: {
        trigger: 'item',
      },
      series: {
        type: 'sankey',
        layout: 'none',
        left: '20%',
        nodeWidth: 60,
        label: {
          fontSize: '18',
          color: '#fff'
        },
        focusNodeAdjacency: 'allEdges',
        data: objArr,
        links: data
      }
    };
    this.mapIntance.setOption(this.optionssankeyCome);
  }
  chartClick(event) {
    const obj = [];
    console.log(this.piedata[event.data.index]);
    this.piedata[event.data.index].forEach(element => {
      obj.push([Number(element.avg_time), element.trans_name]);
    });

    this.setoption(event.data.name, obj);
  }
  // radioChange() {
  //   this.setoption(this.obj.data.name);
  // }
  transChange() {
    console.log(event);

    this.trans_detail(this.selectedValue.txcode);
    this.isChart = true;

  }
  viewChange() {
    console.log('a');

    super.submit(
      'TX400007',
      'sourceTarget',
      'source_target',
      {
        view_code: this.selectedValue.view
      }
    );
  }
  rowActionsHandler(event) {
    if (event.key === 'look') {

    }
  }

  clickActiveHandler(event) {
    console.log(this.transDetail.trans_bhv_list);
    this.isChart = false;
    this.drawerdata = this.transDetail.trans_bhv_list[event.trans_serial_no];
  }

  // 点击tab事件
  clickTab(item, i) {
    this.clickTabIndex = i;
    this.SelectedIndex = item.index;
    this.selectedValue.txcode = null;
    switch (this.SelectedIndex) {
      case 1:
        this.selectedValue.txcode = this.transList !== undefined ? this.transList[0]['trans_code'] : null;
        this.transChange();
        break;
      case 2:

        this.area_count();
        break;
      case 3:

        this.view_list();

        break;

    }

  }
}

