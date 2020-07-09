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
import { IfearmService } from '../../../../service/ifearm.service';

const transCode = 'tx990508';
const transName = '网点画像';
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
  selector: 'app-tx990508',
  templateUrl: './tx990508.component.html',
  styleUrls: ['./tx990508.component.css'],
})
export class Tx990508Component extends BaseTransaction {
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
  resultData: any;
  text = '';
  tabData = [
    { name: '网点画像概览', index: 0 },
    { name: '基本情况', index: 1 },
    { name: '资源配置', index: 2 },
    { name: '业务规模', index: 3 },
    { name: '运营效率', index: 4 },
    { name: '外部环境', index: 5 },
    { name: '营销推广', index: 6 },
  ];
  queryData = [];
  violetDivData = [];
  blueDivData = [];
  pinkDivData = [];
  greenDivData = [];
  orangeDivData = [];
  violetDiv = {
    title: '基本情况',
    isShow: true,
    isUi: true,
    rank_score: '',
    data: this.violetDivData
  };
  blueDiv = {
    title: '资源配置',
    isShow: true,
    isUi: true,
    optionsDiv: {},
    data: this.blueDivData
  };
  pinkDiv = {
    isShow: true,
    title: '业务规模',
    data: this.pinkDivData
  };
  greenDiv = {
    isShow: true,
    title: '运营效率',
    isUi: true,
    optionsDiv: {},
    data: this.greenDivData
  };
  orangeDiv = {
    isShow: true,
    title: '外部环境',
    data: this.orangeDivData
  };
  dict = {};
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    if (this.params !== undefined) {
      this.baseForm.setValue('org_code', this.params.org_code);
      this.baseForm.setValue('org_name', this.params.org_name);
      this.dict = this.params.dict;
    }
    setTimeout(() => {
      this.temp = true;
    });
    this.queryButton();
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
        console.log(obj);
        if (obj.length === 0) {
          this.isQuery = false;
          this.text = '暂未查询到符合条件的网点，请重新查询!';
        } else {
          obj.forEach(element => {
            this.returnDict(element);
          });
          this.queryData = obj;
          this.violetDivData = [{ label: '网点名称', value: obj[0].org_name },
          { label: '网点号', value: obj[0].org_code },
          { label: '电话', value: obj[0].service_tel },
          { label: '邮编', value: obj[0].postcode },
          { label: '地址', value: obj[0].org_addr },
          { label: '省份', value: obj[0].province },
          { label: '城市', value: obj[0].city },
          { label: '线级', value: obj[0].wire_level },
          { label: '级别', value: obj[0].org_level }];
          this.blueDivData = [{ label: '大堂经理', value: obj[0].lobby_manager },
          { label: '客户经理', value: obj[0].customer_manager },
          { label: '综合柜员', value: obj[0].comprehensive_teller },
          { label: '网点主管', value: obj[0].property_supervisor },
          { label: '理财经理', value: obj[0].financial_manager },
          { label: '柜台数量', value: obj[0].counter_number },
          { label: 'ATM数量', value: obj[0].atm_count },
          { label: '场地性质', value: obj[0].site_properties },
          { label: '场地面积', value: obj[0].floor_space }];
          this.pinkDivData = [{ label: '活期账户', value: obj[0].current_account },
          { label: '借记卡', value: obj[0].debit_card },
          { label: '理财账户', value: obj[0].financial_account },
          { label: '白金卡', value: obj[0].platinum_card },
          { label: '普通企业', value: obj[0].ordinary_business },
          { label: '个人存款', value: obj[0].individual_deposit },
          { label: '企业存款', value: obj[0].business_deposit },
          { label: '个人贷款', value: obj[0].personal_loan },
          { label: '企业贷款', value: obj[0].business_deposit },
          { label: '电子银行', value: obj[0].electronic_banking },
          { label: '理财', value: obj[0].financial_management },
          { label: '贵金属', value: obj[0].precious_metal },
          { label: '三方存管', value: obj[0].third_party_custody }];
          this.greenDivData = [{ label: '人均户数', value: obj[0].per_capita_number },
          { label: '人均存款', value: obj[0].per_capita_deposit },
          { label: '人均贷款', value: obj[0].per_capita_loans },
          { label: '人均费用', value: obj[0].per_capita_cost },
          { label: '日均交易', value: obj[0].daily_trans },
          { label: '平均排队', value: obj[0].queue_time },
          { label: '投诉比例', value: obj[0].proportion_complaints },
          { label: '增量客户', value: obj[0].customer_increment },
          { label: '流失客户', value: obj[0].lossing_customer }];
          this.orangeDivData = [{ label: '学校', value: obj[0].school },
          { label: '医院', value: obj[0].hospital },
          { label: '白金卡', value: obj[0].platinum_card },
          { label: 'GDP', value: obj[0].gdp },
          { label: '人均收入', value: obj[0].per_capita_income },
          { label: '高铁', value: obj[0].high_speed },
          { label: '机场', value: obj[0].airport },
          { label: '长途车站', value: obj[0].coach_station }];
          this.isQuery = true;
          this.setTabIndex0();
        }
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
  queryButton() {
    this.tabIndex = 0;
    const obj = this.baseForm.getData();
    console.log(obj);
    const obj1 = {
      org_code: obj.org_code,
      org_name: obj.org_name,
      searchItems: {
      },
      symbol: '1',
      province: '',
      page: {
        CurrentPage: '1',
        Itemsperpage: '10'
      }
    };
    super.submit(
      'TX400004',
      'detail',
      'queryDetail',
      obj1
    );
  }
  resetButton() {
    this.baseForm.setValue('org_code', undefined);
    this.baseForm.setValue('org_name', undefined);
  }
  changTab(event) {
    console.log(event);
    this.tabIndex = event;
    if (this.queryData.length > 0) {
      switch (event) {
        case 0:
          this.isQuery = true;
          this.text = '';
          this.setTabIndex0();
          break;
        case 1:
          this.isQuery = true;
          this.text = '';
          this.setTabIndex1();
          break;
        case 2:
          this.isQuery = true;
          this.text = '';
          this.setTabIndex2();
          break;
        case 3:
          this.isQuery = true;
          this.text = '';
          this.setTabIndex3();
          break;
        case 4:
          this.isQuery = true;
          this.text = '';
          this.setTabIndex4();
          break;
        case 5:
          this.isQuery = true;
          this.text = '';
          this.setTabIndex5();
          break;
        default:
          this.isQuery = false;
          this.text = '暂未开发，敬请期待！';
          break;
        // case 2:
        //   // this.setTabIndex2();
        //   break;
        // case 3:
        //   // this.setTabIndex3();
        //   break;
        // case 4:
        //   break;
      }
    }
  }
  setTabIndex0() {
    this.violetDiv = {
      title: '基本情况',
      rank_score: '',
      isShow: true,
      isUi: true,
      data: this.violetDivData
    };
    this.blueDiv = {
      title: '资源配置',
      isShow: true,
      isUi: true,
      optionsDiv: {},
      data: this.blueDivData
    };
    this.pinkDiv = {
      isShow: true,
      title: '业务规模',
      data: this.pinkDivData
    };
    this.greenDiv = {
      isShow: true,
      title: '运营效率',
      isUi: true,
      optionsDiv: {},
      data: this.greenDivData
    };
    this.orangeDiv = {
      isShow: true,
      title: '外部环境',
      data: this.orangeDivData
    };
  }
  setTabIndex1() {
    this.violetDiv.isUi = false;
    this.violetDiv.title = '评分';
    this.violetDiv.rank_score = this.queryData[0].rank_score;
    this.blueDiv.isShow = false;
    this.pinkDiv.isShow = false;
    this.greenDiv = {
      isShow: true,
      title: '业务属性',
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '业务范围', value: this.queryData[0].scope_business },
        { label: '业务类型', value: this.queryData[0].business_type },
        { label: '网点等级', value: this.queryData[0].org_level },
        { label: '网点类型', value: this.queryData[0].org_type }
      ]
    };
    this.orangeDiv = {
      isShow: true,
      title: '网点属性',
      data: [
        { label: '网点名称', value: this.queryData[0].org_name },
        { label: '网点号', value: this.queryData[0].org_code },
        { label: '网点地址', value: this.queryData[0].org_addr },
        { label: '电话', value: this.queryData[0].service_tel },
        { label: '信用卡客服', value: this.queryData[0].credit_tel },
        { label: '营业时间', value: this.queryData[0].business_time },
        { label: '开业时长', value: this.queryData[0].open_time }
      ]
    };
  }
  setTabIndex2() {
    this.pinkDiv.isShow = false;
    this.violetDiv = {
      title: '人员配置',
      rank_score: '',
      isShow: true,
      isUi: true,
      data: [
        { label: '大堂经理', value: this.queryData[0].lobby_manager },
        { label: '客户经理', value: this.queryData[0].customer_manager },
        { label: '综合柜员', value: this.queryData[0].comprehensive_teller },
        { label: '网点主管', value: this.queryData[0].property_supervisor },
        { label: '理财经理', value: this.queryData[0].financial_manager },
        { label: '安保', value: this.queryData[0].security },
        { label: '清洁', value: this.queryData[0].clean },
        { label: '外聘人员', value: this.queryData[0].expatriates }
      ]
    };
    this.blueDiv = {
      title: '设备配置',
      isShow: true,
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '柜台数量', value: this.queryData[0].counter_number },
        { label: 'ATM数量', value: this.queryData[0].atm_count },
        { label: 'STM数量', value: this.queryData[0].stm_count },
        { label: '排队机', value: this.queryData[0].queuing_machine }
      ]
    };
    this.greenDiv = {
      isShow: true,
      title: '场地配置',
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '场地性质', value: this.queryData[0].site_properties },
        { label: '场地面积', value: this.queryData[0].floor_space }
      ]
    };
    this.orangeDiv = {
      isShow: true,
      title: '费用配置',
      data: [
        { label: '员工工资', value: this.queryData[0].employee_salary },
        { label: '场地租金', value: this.queryData[0].venue_rental },
        { label: '水电费', value: this.queryData[0].utilities },
        { label: '办公费用', value: this.queryData[0].office_expenses },
        { label: '差旅费', value: this.queryData[0].travel_expense }
      ]
    };
  }
  setTabIndex3() {
    this.pinkDiv.isShow = false;
    this.violetDiv = {
      title: '客户类',
      rank_score: '',
      isShow: true,
      isUi: true,
      data: [
        { label: '活期账户', value: this.queryData[0].current_account },
        { label: '借记卡', value: this.queryData[0].debit_card },
        { label: '理财账户', value: this.queryData[0].financial_account },
        { label: '白金卡', value: this.queryData[0].platinum_card },
        { label: '私人银行', value: this.queryData[0].private_bank },
        { label: '小微企业', value: this.queryData[0].small_micro_businesses },
        { label: '普通企业', value: this.queryData[0].ordinary_business }
      ]
    };
    this.blueDiv = {
      title: '负责类',
      isShow: true,
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '个人存款', value: this.queryData[0].individual_deposit },
        { label: '企业存款', value: this.queryData[0].business_deposit }
      ]
    };
    this.greenDiv = {
      isShow: true,
      title: '资产类',
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '个人贷款', value: this.queryData[0].personal_loan },
        { label: '企业贷款', value: this.queryData[0].enterprise_loan }
      ]
    };
    this.orangeDiv = {
      isShow: true,
      title: '签约类',
      data: [
        { label: '电子银行', value: this.queryData[0].electronic_banking },
        { label: '理财', value: this.queryData[0].financial_management },
        { label: '贵金属', value: this.queryData[0].precious_metal },
        { label: '三方存管', value: this.queryData[0].third_party_custody }
      ]
    };
  }
  setTabIndex4() {
    this.pinkDiv.isShow = false;
    this.orangeDiv.isShow = false;
    this.violetDiv = {
      title: '人均效率',
      rank_score: '',
      isShow: true,
      isUi: true,
      data: [
        { label: '人均户数', value: this.queryData[0].per_capita_number },
        { label: '人均存款', value: this.queryData[0].per_capita_deposit },
        { label: '人均贷款', value: this.queryData[0].per_capita_loans },
        { label: '人均费用', value: this.queryData[0].per_capita_cost }
      ]
    };
    this.blueDiv = {
      title: '服务效率',
      isShow: true,
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '日均交易', value: this.queryData[0].daily_trans },
        { label: '平均排队(分钟)', value: this.queryData[0].queue_time },
        { label: '投诉比例', value: this.queryData[0].proportion_complaints }
      ]
    };
    this.greenDiv = {
      isShow: true,
      title: '营销业绩',
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '增量客户', value: this.queryData[0].customer_increment },
        { label: '流失客户', value: this.queryData[0].lossing_customer },
        { label: '活动客户', value: this.queryData[0].active_customer }
      ]
    };
  }
  setTabIndex5() {
    this.pinkDiv.isShow = false;
    this.violetDiv = {
      title: '商圈',
      rank_score: '',
      isShow: true,
      isUi: true,
      data: [
        { label: '商业', value: this.queryData[0].business },
        { label: '学校', value: this.queryData[0].school },
        { label: '医院', value: this.queryData[0].hospital },
        { label: '社区', value: this.queryData[0].community }
      ]
    };
    this.blueDiv = {
      title: '经济',
      isShow: true,
      isUi: true,
      optionsDiv: {},
      data: [
        { label: 'GDP', value: this.queryData[0].gdp },
        { label: '人均收入', value: this.queryData[0].per_capita_income }
      ]
    };
    this.greenDiv = {
      isShow: true,
      title: '交通',
      isUi: true,
      optionsDiv: {},
      data: [
        { label: '高铁', value: this.queryData[0].high_speed },
        { label: '机场', value: this.queryData[0].airport },
        { label: '长途车站', value: this.queryData[0].coach_station }
      ]
    };
    this.orangeDiv = {
      isShow: true,
      title: '竞争',
      data: [
        { label: '他行网点', value: this.queryData[0].other_bank },
        { label: '非银网点', value: this.queryData[0].no_bank }
      ]
    };
  }
}
