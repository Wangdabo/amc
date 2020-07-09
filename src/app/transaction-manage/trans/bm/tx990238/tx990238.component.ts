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
const transCode = 'tx990238';
const transName = '元件配置';
const tableName = '';
const exFuncCode = ['tranattrQuery', 'batchInsert'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990238',
  templateUrl: './tx990238.component.html',
  styleUrls: ['./tx990238.component.css'],
})
export class Tx990238Component extends BaseTransaction {
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
  isShow = false;
  selectValue = false;
  saveItem: any;
  type = [
    { label: '0 - 来自常量', value: '0' },
    { label: '1 - 来自数据库', value: '1' },
    { label: '2 - 手工指定', value: '2' },
    { label: '3 - 来自业务字典', value: '3' },
  ];
  SelectedIndex = 0;

  constructor(public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private router: Router,

  ) {
    super(transCode);
  }

  onEnterAfter(): void {
    console.log(this.params);

    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);
    this.queryattr();
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
      case 'tranattrQuery':
        console.log(result);
        // const dest = this.getData(result.bdy.data);
        const element = result.resultdata.bdy.data;
        let map = {},
          dest = [];
        for (let i = 0; i < element.length; i++) {
          const ai = element[i];
          let tablename, filedname, filed, sql, dict, constant;
          constant = [
            { attr_value: null, attr_desc: null }
          ];
          if (ai.ext_source_config !== undefined) {
            switch (ai.ext_source_type) {
              case '0':
                const objarr = this.getString(ai.ext_source_config, 0);
                constant = objarr;
                break;
              case '1':
                const obj = this.getString(ai.ext_source_config, 1);
                tablename = obj['tablename'];
                filedname = obj['namefield'];
                filed = obj['valuefield'];
                sql = obj['wheresql'];
                break;
              case '3':
                dict = ai.ext_source_config;
                break;
              default:
                break;
            }
          }
          ai.ext = {
            dict: dict,
            sql: sql,
            filed: filed,
            tablename: tablename,
            filedname: filedname,
            constant: constant
          };
          if (!map[ai.attr_key]) {
            dest.push({
              attr_key: ai.attr_key,
              tran_ctl_desc: ai.tran_ctl_desc,
              radioValue: null,
              tran_config_part: ai.tran_config_part,
              mark: ai.mark,
              item: [ai]
            });
            map[ai.attr_key] = ai;
          } else {
            for (let j = 0; j < dest.length; j++) {
              const dj = dest[j];
              if (dj.attr_key === ai.attr_key) {
                dj.item.push(ai);
                break;
              }
            }
          }
        }
        this.tabs = dest;
        this.saveItem = JSON.stringify(this.tabs);
        break;
      case 'batchInsert':
        console.log(result);
        if (result.returncode === '000000') {
          this.queryattr();
          this.notification.create(
            'success',
            '保存成功',
            ''
          );
        }
        break;
    }
  }

  nzSelectedIndexChange(event) {
    // this.saveItem = JSON.stringify(this.tabs[event].item);

  }
  // 字符串处理.............................................................!
  getString(dataStr, index) {
    let objArr;
    if (index === 1) {
      const peopleArr = dataStr.split('|');
      console.log(peopleArr);
      objArr = {};
      peopleArr.forEach(element => {
        const peopleData = element.toString().split(':');
        objArr[peopleData[0]] = peopleData[1];
      });
    } else {
      const peopleArr = dataStr.split(',');
      objArr = [];
      peopleArr.forEach(element => {
        const str = element.toString().split('|');
        objArr.push({ attr_value: str[0].substr(6, str[0].length), attr_desc: str[1].substr(4, str[1].length) });
        console.log(str);
      });
    }
    console.log(objArr);
    return objArr;
  }
  queryattr() {
    TransCommonApiHelper.conditionQuery(this, 'tranattrQuery', {
      tablename: 'btf_tran_attr_dict',
      page: '1',
      pagesize: '999',
      params: [{
        'logic': 'AND',
        'queryList': [{
          'logic': 'AND',
          'operator': 'EQ',
          'params': ['tran_config_part', this.params.item.tran_config_part]
        }]
      }]

    });
  }
  imgIcon() {
    super.skipSonRoute('tx990512', {
    });

  }
  add(event) {
    this.isShow = !this.isShow;
    if (this.isShow) {
      this.addPushitem(event, 0);
    } else {
      let obj;
      obj = [];
      event.item.forEach((element, index) => {
        if (this.checkValue(element.attr_desc) && this.checkValue(element.attr_value)) {
          obj.push(element);
        }
      });
      console.log(obj);

    }


  }
  checkValue(event) {
    if (event === undefined && event === null && event === '') {
      return false;
    } else {
      return true;
    }
  }
  // 新增
  addPushitem(event, index) {
    if (index === 0) {
      event.item.push(
        {
          attr_desc: '',
          attr_key: event.attr_key,
          attr_value: '',
          is_ext: '',
          mark: event.mark,
          tran_config_part: event.tran_config_part,
          tran_ctl_desc: event.tran_ctl_desc,
          ext_is_multi: '',
          ext_source_type: '',
          ext_source_config: '',
          ext: {
            dict: null,
            sql: null,
            filed: null,
            tablename: null,
            filedname: null,
            constant: [
              { attr_value: null, attr_desc: null }
            ]
          }
        }
      );
      console.log(event);

    } else {
      event.push(
        { attr_value: null, attr_desc: null }
      );
    }

  }
  del(event, index) {
    event.splice(index, 1);
  }
  onChange(event) {
  }
  newTab() {
    this.tabs.push(
      {
        attr_key: '',
        item: [],
        mark: '',
        radioValue: null,
        tran_config_part: this.params.item.tran_config_part,
        tran_ctl_desc: '',
      }
    );
    this.SelectedIndex = this.tabs.length - 1;

  }
  closeTab(tab): void {
    this.modelService.confirm({
      nzTitle: '<i>确定删除当前元件吗?</i>',
      nzContent: '',
      nzOnOk: () => this.tabs.splice(tab, 1)
    });
  }
  // 重置
  reset() {
    this.tabs = JSON.parse(this.saveItem);
  }
  // 保存
  save() {

    const arr = [];
    this.tabs.forEach(x => {
      x.item.forEach(y => {
        let str = '';
        y.ext.constant.forEach((i, j) => {
          if (j !== y.ext.constant.length - 1) {
            str += 'value:' + i.attr_value + '|name:' + i.attr_desc + ',';
          } else {
            str += 'value:' + i.attr_value + '|name:' + i.attr_desc;
          }
        });
        const sql = 'tablename:' + y.ext.tablename + '|namefield:' +
          y.ext.filedname + '|valuefield:' + y.ext.filed + '|wheresql:' + y.ext.sql;
        switch (y.ext_source_type) {
          case '0':
            y.ext_source_config = str;
            break;
          case '1':
            y.ext_source_config = sql;
            break;
          case '3':
            y.ext_source_config = y.ext.dict;
            break;
          default:
            y.ext_source_config = null;
            break;
        }
        arr.push(y);
      });

    });
    const obj = {
      tablename: 'btf_tran_attr_dict',
      deletebyfieldname: 'tran_config_part',
      deletebyfieldvalue: this.params.item.tran_config_part,
      data: arr
    };


    super.submit('TX001', 'batchInsert', 'deleteAndInsertBatch', obj);



  }

}


