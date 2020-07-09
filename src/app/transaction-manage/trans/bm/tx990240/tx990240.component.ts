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
import * as echarts from 'echarts';
import '../../../../../../node_modules/echarts/extension/bmap/bmap.js';
import { Router } from '@angular/router';
import { TransCommonApiHelper } from '../../trans-common-api-helper';
import { DatePipe } from '@angular/common';

const transCode = 'tx990240';
const transName = '交易监控';
const tableName = '';
const exFuncCode = ['treeDataQuery', 'queryCode', 'saveData'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990240',
  templateUrl: './tx990240.component.html',
  styleUrls: ['./tx990240.component.css'],
})
export class Tx990240Component extends BaseTransaction {
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
  @Input('params') params: any;
  tabs = [];
  nzTabBarStyle = {
    'margin-left': '10px'
  };
  treeData = [];
  monitorid: string;
  topSelects = [];
  isEdit = false;
  SelectedIndex = 0;
  isshowTab = false;

  nodes = [{
    title: '自助机具业务',
    key: '0',
    expanded: true,
    children: [{
      title: 'TX011054ATM转账签约信息查询',
      key: '1',
      isLeaf: true
    }, {
      title: 'TX011054ATM转账签约信息查询',
      key: '0-0-1',
      isLeaf: true
    }, {
      title: 'TX011054ATM转账签约信息查询',
      key: '0-0-2',
      isLeaf: true
    }]
  }, {
    title: '普通结算',
    key: '1',
    children: [
      { title: 'TX011054ATM转账签约信息查询', key: '0-1-0-0', isLeaf: true },
      { title: 'TX011054ATM转账签约信息查询', key: '0-1-0-1', isLeaf: true },
      { title: 'TX011054ATM转账签约信息查询', key: '0-1-0-2', isLeaf: true }
    ]
  }];
  defaultCheckedids = [];
  defaultCheckedKeys = [];
  menuList: Array<{ key: string | number, value: string }>;

  objArr = {
    config_name: '',
    config_desc: '',
    config_detail: '',
    alarmTimeB: new Date(),
    alarmTimeE: new Date(),
    id: '',
    data: [
      { label: '刷新间隔时间（单位：秒）', value: '', filed: 'refreshInterval' },
      { label: '无交易时间阀值（单位：秒） ', value: '', filed: 'noTrading' },
      { label: '（按产品）连续失败交易数阀值（单位：笔）', value: '', filed: 'continuousFailP' },
      { label: '（按网点）连续失败交易阀值（单位：笔）', value: '', filed: 'continuousFailD' },
      { label: '（按产品）交易成功率统计间隔时间（单位：秒）', value: '', filed: 'continuousSucP' },
      { label: '（按网点）交易成功率统计间隔时间（单位：秒', value: '', filed: 'continuousSucD' },
      { label: '（按产品）交易平均成功率阀值（单位：%）', value: '', filed: 'averageSucP' },
      { label: '（按网点）交易平均成功率阀值（单位：%）', value: '', filed: 'averageSucD' },
      { label: '交易峰值统计间隔时间（单位：秒）', value: '', filed: 'tradingPeakTime' },
      { label: '交易峰值阀值（单位：笔）', value: '', filed: 'tradingPeakThreshold' },
    ]
  };
  sindex: any;
  menuId: any;
  clicknodeinfo: any;
  nodeinfo: any;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  ids: string;
  formatOne = percent => `${percent} S`;
  constructor(public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private router: Router,
    private datePipe: DatePipe

  ) {
    super(transCode);
  }

  onEnterAfter(): void {

    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);
    this.getCode();
    this.getTree();
  }

  listDataCallback(data: any): void {
  }

  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    );
    switch (tcFuncCode) {
      case 'treeDataQuery':
        const resultData = TransactionContextHelper.getServiceResult(transactionContext, tcFuncCode).resultdata;
        this.treeData = resultData.bdy.data.map(item => {
          return { title: item.menu_name, treenodeid: item.menu_code, pid: item.parent_id, icon: 'menu-unfold', ...item };
        });
        this.setDefultKey();

        console.log(this.treeData);

        break;
      case 'queryCode':
        this.topSelects = result.resultdata.bdy.data;
        this.monitorid = this.params.id;

        this.cancel();
        this.setDefultKey();
        // this.objArr.config_desc
        break;
      case 'saveData':
        if (result.returncode === '000000') {
          this.getCode();
          this.notification.create(
            'success',
            '保存成功',
            ''
          );
        }
        break;

    }
  }
  getTree() {
    TransCommonApiHelper.conditionQuery(this, 'treeDataQuery', { tablename: 'btf_menu', page: '1', pagesize: '999' });
  }
  treeEvent(event) {
    /* if (event.event.eventName === 'expand') {

     }
     if (event.event.eventName === 'click') {

     }*/
  }
  ngModelChange(event) {
    this.monitorid = event;
    this.cancel();
  }
  clickEventHandler(event) {
    this.sindex = 0;
    if (!this.isshowTab) {
      this.isshowTab = true;
    }
    this.menuId = event.event.key;
    this.clicknodeinfo = event.event;
    setTimeout(_ => {
      this.showDetail();
    });
  }
  showDetail() {
    this.getSelDetail();
    this.baseForm.disabledAll();
    this.baseForm.initData(this.nodeinfo);
  }
  getSelDetail() {
    this.nodeinfo = this.clicknodeinfo.origin;
  }
  getCode() {
    this.isEdit = false;
    TransCommonApiHelper.conditionQuery(this, 'queryCode', {
      tablename: 'btf_trans_monitor_config',
      page: '1',
      pagesize: '999'
    });
  }
  nzSelectedIndexChange(event) {
  }
  nzEvent(event) {

  }
  add() {
    this.isEdit = true;
    let i: string;
    for (i in this.objArr) {
      if (i !== 'data') {
        this.objArr[i] = null;
      }
    }
    this.defaultCheckedKeys = [];
    this.objArr.data.forEach(j => {
      j.value = '';
    });
  }
  changeEdit() {
    this.isEdit = !this.isEdit;
  }
  goConfig() {
    super.skipSonRoute('tx990239', {});

  }
  cancel() {
    this.topSelects.forEach(i => {
      if (i.id === this.monitorid) {
        this.objArr.config_desc = i.config_desc;
        this.objArr.config_name = i.config_name;
        this.objArr.id = i.id;
        const data = this.setString(i.config_detail);
        this.objArr.data = [
          { label: '刷新间隔时间（单位：秒）', value: '', filed: 'refreshInterval' },
          { label: '无交易时间阀值（单位：秒） ', value: '', filed: 'noTrading' },
          { label: '（按产品）连续失败交易数阀值（单位：笔）', value: '', filed: 'continuousFailP' },
          { label: '（按网点）连续失败交易阀值（单位：笔）', value: '', filed: 'continuousFailD' },
          { label: '（按产品）交易成功率统计间隔时间（单位：秒）', value: '', filed: 'continuousSucP' },
          { label: '（按网点）交易成功率统计间隔时间（单位：秒', value: '', filed: 'continuousSucD' },
          { label: '（按产品）交易平均成功率阀值（单位：%）', value: '', filed: 'averageSucP' },
          { label: '（按网点）交易平均成功率阀值（单位：%）', value: '', filed: 'averageSucD' },
          { label: '交易峰值统计间隔时间（单位：秒）', value: '', filed: 'tradingPeakTime' },
          { label: '交易峰值阀值（单位：笔）', value: '', filed: 'tradingPeakThreshold' },
        ];
        this.objArr.data.forEach(j => {

          data.forEach(x => {
            if (x.filed === j.filed) {
              j.value = x.value;
            }
            if (x.filed === 'alarmTimeB') {
              this.objArr.alarmTimeB = x.value;
            }
            if (x.filed === 'alarmTimeE') {
              this.objArr.alarmTimeE = x.value;
            }
            if (x.filed === 'data') {
              this.defaultCheckedids = x.value;
            }
          });
        });
      }
    });
    this.setDefultKey();
    console.log(this.defaultCheckedKeys);

  }
  setDefultKey() {
    this.defaultCheckedKeys = [];
    // if()
    this.treeData.forEach(i => {
      this.defaultCheckedids.forEach(j => {
        if (i.id === j) {
          console.log(i);
          this.defaultCheckedKeys.push(i.menu_code);
        }
      });
    });
  }

  checkedEventHandler(item) {
    let ids;
    ids = [];
    item.event.forEach(i => {
      ids.push(i.origin.id);
      if (i.children.length > 0) {
        i.children.forEach(j => {
          ids.push(j.origin.id);
        });
      }
    });
    this.ids = ids.join('-');

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

  saveObj() {
    this.modelService.confirm({
      nzTitle: '是否确认提交监控方案?',
      nzOkText: '确认',
      nzOkType: 'danger',
      nzOnOk: () => this.okSave(),
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });

  }
  okSave() {
    let obj;
    obj = {};
    this.objArr.data.forEach(i => {
      obj[i.filed] = i.value;
    });


    obj.alarmTimeB = this.objArr.alarmTimeB;
    obj.alarmTimeE = this.objArr.alarmTimeB;
    obj.id = this.objArr.id;
    let j: string;
    const config_detail = [];
    for (j in obj) {
      config_detail.push(j + ':' + obj[j]);
    }
    config_detail.push('data:' + this.ids);
    let submitData = {};
    if (obj.id) {
      submitData = {
        config_desc: this.objArr.config_desc,
        config_detail: config_detail.join(','),
        config_name: this.objArr.config_name,
        id: this.objArr.id
      };
      TransCommonApiHelper.update(this, 'saveData', {
        tablename: 'btf_trans_monitor_config',
        data: submitData
      });
    } else {
      submitData = {
        config_desc: this.objArr.config_desc,
        config_detail: config_detail.join(','),
        config_name: this.objArr.config_name,
      };
      TransCommonApiHelper.insert(this, 'saveData', {
        tablename: 'btf_trans_monitor_config',
        data: submitData
      });
    }
  }

}


