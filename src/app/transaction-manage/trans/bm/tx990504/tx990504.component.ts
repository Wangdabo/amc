import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import {FormComponent} from "tms-platform-component";
import { SettingService } from '../../../../service/setting.service';
import { BaseTransaction } from '../../base-transaction';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { HttpClient } from '@angular/common/http';
import { IfearmService } from '../../../../service/ifearm.service';

const transCode = 'tx990504';
const transName = '客户画像';
const tableName = '';
const exFuncCode = ['queryData', 'queryfiled'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};

@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990504',
  templateUrl: './tx990504.component.html',
  styleUrls: ['./tx990504.component.css'],
})
export class Tx990504Component extends BaseTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>;
  @Input('params') params: any;
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
  img = this.ifearm.imgSrc;

  constructor(public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private ifearm: IfearmService
  ) {
    super(transCode);
  }
  theme: string;
  isQuery = false;
  temp = false;
  queryHeader = [];
  optionsDiv = {};
  tabIndex = 0;
  SelectedIndex = 0;
  resultData: any;
  tabData = [
    { name: '个人画像概览', index: 0 },
    { name: '个人信息', index: 1 },
    { name: '基本情况', index: 2 },
    { name: '支出偏好', index: 3 },
    { name: '资产属性', index: 4 },
    { name: '风险属性', index: 5 },
    { name: '兴趣爱好', index: 6 },
  ];

  tabs = [
    { title: '个人画像概览', index: 0, src:'./assets/newimage/Insight/btn_selected.png' },
    { title: '个人信息', index: 1, src:'./assets/newimage/Insight/btn_normal.png' },
    { title: '基本情况', index: 2, src:'./assets/newimage/Insight/btn_normal.png' },
    { title: '支出偏好', index: 3, src:'./assets/newimage/Insight/btn_normal.png' },
    { title: '资产属性', index: 4, src:'./assets/newimage/Insight/btn_normal.png' },
    { title: '风险属性', index: 5, src:'./assets/newimage/Insight/btn_normal.png' },
    { title: '兴趣爱好', index: 6, src:'./assets/newimage/Insight/btn_normal.png' },
  ];

  violetDiv = {
    title: '个人信息',
    isShow: true,
    isUi: true,
    data: [
      { label: '姓名', value: '庄壮成' },
      { label: '性别', value: '男' },
      { label: '年龄', value: '28' },
      { label: '地级城市', value: '' },
      { label: '手机号', value: '15000275741' },
      { label: '单位电话号码', value: '0535-6755863' },
      { label: '职务', value: '会计师' },
      { label: '单位名称', value: '静海公司' },
      { label: '归属机构', value: '中国银行潍坊文化路支行' }
    ]
  };
  blueDiv = {
    title: '风险属性',
    isShow: true,
    isUi: true,
    optionsDiv: {},
    data: [
      { label: '经济流量', value: '赤字' },
      { label: '流水稳定性', value: '正常' },
      { label: '消费稳定性', value: '正常' },
      { label: '资产稳定性', value: '正常' },
      { label: '资产负增长稳定性', value: '正常' },
      { label: '资产正增长稳定性', value: '异常' },
      { label: '风险偏好', value: '高风险' },
      { label: '有无分期消费', value: '无' },
      { label: '信用卡取现偏好', value: '中[40%,60%)' }
    ]
  };
  pinkDiv = {
    isShow: true,
    title: '资产属性',
    data: [
      { label: '资产等级', value: '[5w,30w)' },
      { label: '资产忠诚度', value: '[80%,100%]' },
      { label: '资产全国排名', value: '全国排名第八名(5%,10%]' },
      { label: '主资产占比', value: '(20%,40%]' },
      { label: '常规经济表现', value: '(44770,61000]' },
      { label: '客户默认等级', value: '特殊理财客户' },
      { label: '全行总资产', value: '2532612' },

    ]
  };
  greenDiv = {
    isShow: true,
    title: '支出偏好',
    isUi: true,
    optionsDiv: {},
    data: [
      { label: '时段偏好（日）', value: '无明显偏好' },
      { label: '购买力全国排名', value: '全国排名第四' },
      { label: '购买力省排名', value: '省排名第五名' },
      { label: '消费习惯偏好', value: '理性消费者' },
      { label: '投资风险偏好', value: '低风险偏好' },
      { label: '是否为历史理财用户', value: '不是理财用户' },
      { label: '理财活跃度', value: '低活跃度' },

    ]
  };
  orangeDiv = {
    isShow: true,
    title: '支出偏好',
    data: [
      { label: '手机银行持有情况', value: '有' },
      { label: '信用卡活跃指数', value: '(0.9,1]' },
      { label: '储蓄卡活跃指数', value: '(0.9,0.95]' },
      { label: '近期有无信用消费经历', value: '无' },
      { label: '近期有无金融交易经历', value: '无' },
    ]
  };
  dict = {};
  onEnterAfter(): void {

    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    this.getDict();
    if (this.params !== undefined) {
      this.baseForm.setValue('customer_name', this.params.customer_name);
      this.baseForm.setValue('customer_tel', this.params.customer_tel);
    }
    setTimeout(() => {
      this.temp = true;
    });
  }
  listDataCallback(data: any): void {
  }
  getQueryData(event) {

  }
  reset(event) {

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
          'aum_amt_all', 'cons_rank', 'cons_active_index', 'power_rank_country', 'cons_power_rank_pro', 'credit_card_active_index',
          'card_num', 'card_active_index', 'credit_num', 'tel_joinnet_time', 'tel_realname_flag', 'on_job_flag',
          'sex', 'marital_status', 'financial_trans', 'mobile_bank_flg', 'net_bank_flg', 'card_flg', 'reloan_love',
          'credit_card_active_index', 'card_active_index', 'trust_trans', 'cd03_fil13', 'credit_card_flg',
          'rmb_financial_flag', 'reloan_f_love', 'financial_trans_level', 'trust_cons_level', 'financial_trans_level',
          'time_love', 'cons_love', 'cons_f_card_type_love',
          'cons_m_card_type_love', 'cons_channel_love', 'invest_risk_love', 'history_financial_flag', 'manage_active', 'manage_cycle_love',
          'fund_exp', 'treasury_bonds_exp', 'asset_rank_pro', 'asset_main_per', 'zh_asset_flag', 'financial_statble',
          'line_level', 'loan_flag', 'bill_stable', 'cons_stable', 'take_statble', 'asset_stable',
          'un_rise_statble', 'rise_statble', 'instalments_flag', 'invest_type_love',
          'credit_card_cash_love', 'foreign_financial_flag', 'asset_rank_country', 'pt_card_flg', 'phone_bank_flg', 'business_flg', '' +
          'compre_loan_re_fluc_index', 'cus_level', 'tpcc_amt', 'fund_amt', 'fund_cycle_amt', 'metal_amt',
          'bond_amt', 'asset_level', 'asset_loyalty', 'asset_change_index', 'other_financial', 'stable_financial',
          'common_financial', 'risk_grade', 'cash_love', 'cash_f_love', 'transfer_love', 'transfer_f_love', 'repay_love', 'repay_f_love',
          'reloan_love', 'reloan_f_love'

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

  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    ).resultdata.bdy;
    switch (tcFuncCode) {
      case 'queryData':


        console.log(result.data[0]);
        this.resultData = this.returnDict(result.data[0]);
        console.log(this.resultData);



        this.changTab(this.tabIndex);
        break;
      case 'queryfiled':

        this.dict = result.data;
        const obj = this.baseForm.getData();
        const flage = (JSON.stringify(obj) === '{}');
        if (!flage) {
          this.queryButton('query');
        }
        break;

    }
  }
  changTab(event) {
    console.log(event);
    this.tabIndex = event;
    switch (event) {
      case 0:
        this.setTabIndex0();
        break;
      case 1:
        this.setTabIndex1();
        break;
      case 2:
        this.setTabIndex2();
        break;
      case 3:
        this.setTabIndex3();
        break;
      case 4:
        break;
    }

  }
  setTabIndex0() {
    console.log(this.resultData);

    this.violetDiv = {
      title: '个人信息',
      isShow: true,
      isUi: true,
      data: [
        { label: '姓名', value: this.resultData.customer_name },
        { label: '性别', value: this.resultData.out_sex },
        { label: '年龄', value: this.resultData.age },
        { label: '地级城市', value: this.resultData.out_city_name },
        { label: '手机号', value: this.resultData.customer_tel },
        { label: '单位电话号码', value: this.resultData.phone_no_home },
        { label: '职务', value: this.resultData.position },
        { label: '单位名称', value: this.resultData.employer },
        { label: '归属机构', value: this.resultData.cus_branch_name }
      ]
    };
    this.blueDiv = {
      title: '风险属性',
      isShow: true,
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '经济流量', value: '赤字' },
        { label: '流水稳定性', value: '正常' },
        { label: '消费稳定性', value: '正常' },
        { label: '资产稳定性', value: '正常' },
        { label: '资产负增长稳定性', value: '正常' },
        { label: '资产正增长稳定性', value: '异常' },
        { label: '风险偏好', value: this.resultData.risk_grade },
        { label: '有无分期消费', value: '无' },
        { label: '信用卡取现偏好', value: '中[40%,60%)' }
      ]
    };
    this.pinkDiv = {
      isShow: true,
      title: '资产属性',
      data: [
        { label: '资产等级', value: '[5w,30w)' },
        { label: '资产忠诚度', value: '[80%,100%]' },
        { label: '资产全国排名', value: '全国排名第八名(5%,10%]' },
        { label: '主资产占比', value: '(20%,40%]' },
        { label: '常规经济表现', value: '(44770,61000]' },
        { label: '客户默认等级', value: '特殊理财客户' },
        { label: '全行总资产', value: '2532612' },

      ]
    };
    this.greenDiv = {
      isShow: true,
      title: '支出偏好',
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '时段偏好（日）', value: '无明显偏好' },
        { label: '购买力全国排名', value: '全国排名第四' },
        { label: '购买力省排名', value: '省排名第五名' },
        { label: '消费习惯偏好', value: '理性消费者' },
        { label: '投资风险偏好', value: '低风险偏好' },
        { label: '是否为历史理财用户', value: '不是理财用户' },
        { label: '理财活跃度', value: '低活跃度' },

      ]
    };
    this.orangeDiv = {
      isShow: true,
      title: '基本属性',
      data: [
        { label: '手机银行持有情况', value: '有' },
        { label: '信用卡活跃指数', value: '(0.9,1]' },
        { label: '储蓄卡活跃指数', value: '(0.9,0.95]' },
        { label: '近期有无信用消费经历', value: '无' },
        { label: '近期有无金融交易经历', value: '无' },
      ]
    };
  }
  setTabIndex1() {
    this.violetDiv = {
      title: '职业',
      isShow: true,
      isUi: true,
      data: [
        { label: '是否在职', value: '否' },
        { label: '职务', value: '男' },
        { label: '职业代码', value: '28' },
        { label: '单位名称', value: '' },
        { label: '单位地址', value: '15000275741' },
      ]
    };
    this.blueDiv = {
      title: '基本属性',
      isShow: true,
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '客户号', value: '否' },
        { label: '客户姓名', value: '男' },
        { label: '客户类型', value: '28' },
        { label: '性别', value: '' },
        { label: '性别代码', value: '15000275741' },
        { label: '年龄', value: '15000275741' },
        { label: '婚姻状态代码', value: '15000275741' },
        { label: '出生日期', value: '15000275741' },
        { label: '主证件类型', value: '15000275741' },
        { label: '主证件号码', value: '15000275741' },
      ]
    };
    this.orangeDiv = {
      title: '籍贯',
      isShow: true,
      data: [
        { label: '国籍', value: '否' },
        { label: '中国', value: '男' },
        { label: '省份', value: '28' },
        { label: '地级市', value: '' },
        { label: '线级', value: '15000275741' },
        { label: '常住地址', value: '15000275741' },
      ]
    };
    this.pinkDiv = {
      title: '联系方式',
      isShow: true,
      data: [
        { label: '手机号', value: '否' },
        { label: '手机号渠道', value: '男' },
        { label: '手机号入网年限', value: '28' },
        { label: '单位电话号码', value: '' },
        { label: '住宅电话号码', value: '15000275741' },
      ]
    };
    this.greenDiv = {
      title: '机构相关',
      isShow: true,
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '省行机构号', value: '否' },
        { label: '归属机构', value: '男' },
        { label: '机构名称', value: '28' },
        { label: '开户机构号', value: '' },
        { label: '二级机构号', value: '15000275741' },
        { label: '二级机构名称', value: '15000275741' },

      ]
    };
  }
  setTabIndex2() {
    this.violetDiv.title = '评分';
    this.violetDiv.isUi = false;
    this.violetDiv.isShow = true;
    this.pinkDiv.isShow = false;
    this.blueDiv.isShow = false;
    this.orangeDiv = {
      isShow: true,
      title: '银行卡属性',
      data: [
        { label: '信用卡数量', value: '有' },
        { label: '信用卡活跃指数', value: '(0.9,1]' },
        { label: '储蓄卡数量', value: '(0.9,0.95]' },
        { label: '储蓄卡活跃指数', value: '无' },
        { label: '近期有无信用消费经历', value: '无' },
        { label: '近期有无金融交易经历', value: '无' },
        { label: '近期信用消费程度', value: '无' },
        { label: '近期金融交易程度', value: '无' },

      ]
    };
    this.greenDiv = {
      isShow: true,
      title: '持有情况',
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '手机银行持有情况', value: '无明显偏好' },
        { label: '储蓄持有情况', value: '全国排名第四' },
        { label: '网银持有情况', value: '省排名第五名' },
        { label: '借记卡持有情况', value: '理性消费者' },
        { label: '手机短信持有情况', value: '低风险偏好' },
        { label: '信用卡持有情况', value: '不是理财用户' },
        { label: '人民币理财持有情况', value: '低活跃度' },
        { label: '外币理财持有情况', value: '低活跃度' },
        { label: '第三方存管持有情况', value: '低活跃度' },
        { label: '基金持有情况', value: '低活跃度' },
        { label: '基金定投持有情况', value: '低活跃度' },
        { label: '贵金属持有情况', value: '低活跃度' },
        { label: '国债持有情况', value: '低活跃度' },
      ]
    };
  }

  // 公共方法提交
  commonPar(params) {
    let tar;
    if (params[1].value !== '-') {
      tar = params[1];
    } else {
      tar = params[0];
    }
    return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;

  }
  setTabIndex3() {
    this.violetDiv = {
      title: '常规消费类',
      isShow: true,
      isUi: true,
      data: [
        { label: '时段偏好_日', value: '否' },
        { label: '购买力全国排名', value: '男' },
        { label: '购买力省排名', value: '28' },
        { label: '消费习惯偏好', value: '' },
        { label: '消费频次卡类型偏好', value: '15000275741' },
        { label: '消费金额卡类型偏好', value: '15000275741' },
        { label: '消费等级', value: '15000275741' },
        { label: '消费活跃度趋势指数', value: '15000275741' },
        { label: '消费渠道偏好', value: '15000275741' },
      ]
    };
    this.blueDiv.title = '现金消费、转账偏好';
    this.blueDiv.isUi = false;
    this.blueDiv.isShow = true;
    this.blueDiv.optionsDiv = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器,坐标轴触发有效
          type: 'shadow'        // 默认为直线,可选为：'line' | 'shadow'
        },
        formatter: this.commonPar(this.params)
      },
      legend: {
        data: ['金额偏好', '评率偏好']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: ['现金消费', '转账偏好']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '辅助',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            normal: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            }
          },
          data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
        },
        {
          name: '收入',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
        },
        {
          name: '支出',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'bottom'
            }
          },
          data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
        }
      ]
    };
    this.pinkDiv = {
      title: '投资类',
      isShow: true,
      data: [
        { label: '投资风险偏好', value: '否' },
        { label: '是否为历史理财用户', value: '男' },
        { label: '理财活跃度', value: '28' },
        { label: '理财周期偏好', value: '' },
        { label: '基金持有经验', value: '15000275741' },
        { label: '国债持有经验', value: '15000275741' },
        { label: '投资类型偏好', value: '15000275741' },
      ]
    };
    this.orangeDiv.isShow = false;
    this.greenDiv.title = '还款还贷类';
    this.greenDiv.isUi = false;
    this.greenDiv.isShow = true;
    this.greenDiv.optionsDiv = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器,坐标轴触发有效
          type: 'shadow'        // 默认为直线,可选为：'line' | 'shadow'
        },
        formatter: this.commonPar(this.params)
      },
      legend: {
        data: ['支出', '收入']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        splitLine: { show: false },
        data: function () {
          let list = [];
          for (let i = 1; i <= 11; i++) {
            list.push('11月' + i + '日');
          }
          return list;
        }()
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '辅助',
          type: 'bar',
          stack: '总量',
          itemStyle: {
            normal: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            }
          },
          data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
        },
        {
          name: '收入',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
        },
        {
          name: '支出',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'bottom'
            }
          },
          data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
        }
      ]
    };
  }
  queryButton(type) {
    console.log(type);
    if (type === 'query') {
      this.isQuery = true;
      const obj = {
        searchItems: this.baseForm.getData()
      };

      super.submit(
        'TX400002',
        'queryData',
        'detailById',
        obj
      );
    } else {
      this.isQuery = false;
    }

  }


  // 点击内容切换
  clickTab(item) {
    this.tabIndex = item.index;
    switch (this.tabIndex) {
      case 0:
        this.setTabIndex0();
        break;
      case 1:
        this.setTabIndex1();
        break;
      case 2:
        this.setTabIndex2();
        break;
      case 3:
        this.setTabIndex3();
        break;
      case 4:
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


