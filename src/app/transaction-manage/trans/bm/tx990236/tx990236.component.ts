import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import {FormComponent} from "tms-platform-component";
import { SettingService } from '../../../../service/setting.service';
import { BaseTransaction } from '../../base-transaction';
import { OutputAction } from '../../../interface/custom-action/output.action';
import { ResultData, ServiceResult } from 'tms-platform';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { TransCommonApiHelper } from '../../trans-common-api-helper';

const transCode = 'tx990236';
const transName = '交易工厂';
const tableName = 'btf_transset';
const exFuncCode = ['tranattrQuery', 'queryCode', 'batchInsert', 'unitsQuery', 'queryCheckboxs'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {


};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options,
  subTransCodes: []
})
@Component({
  selector: 'app-tx990236',
  templateUrl: './tx990236.component.html',
  styleUrls: ['./tx990236.component.css']
})
export class Tx990236Component extends BaseTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @ViewChild('baseForm2', {static: true})
  baseForm2: FormComponent;

  @Input('params') params: any;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string, transactionContext: TransactionContext
  }>;
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string, tcFuncCode: string, funcCode: string, bdy: any
  }> = new EventEmitter();
  index = 0;
  tabs: any[] = [];
  contabs = [];
  checkValues = [];
  units = [];
  resultDatas = [];
  checkBox = [];
  obj = {
    attr_key: '',
    event: ''
  };
  constructor(
    public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private cd: ChangeDetectorRef) {
    super(transCode);
  }

  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent);

    this.querytext();


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
        this.resultDatas = result.resultdata.bdy.data;
        this.getCode();
        break;
      case 'queryCode':

        this.checkValues = result.resultdata.bdy.data;
        console.log(this.checkValues);
        this.tabs = [];
        const arr = [];
        for (let i = 0; i < this.units.length; i++) {
          const strarr = {
            label: this.units[i].part_name,
            isshow: false,
            value: this.units[i].tran_config_part,
            arr: []
          };
          for (let j = 0; j < this.checkValues.length; j++) {
            if (this.units[i].tran_config_part === this.checkValues[j].tran_config_part) {
              strarr.isshow = true;
              arr.push(strarr);
              break;
            }
          }
          this.tabs.push(strarr);
        }
        if (arr.length > 0) {
          const data = {
            'checkboxName': this.baseForm.checkinit('USER_TRAN_UNIT', arr)
          };
          this.baseForm.initData(data);
        }

        console.log(this.tabs);
        this.tabs.forEach(element => {
          element.arr = [];
          this.resultDatas.forEach(j => {
            if (element.value === j.tran_config_part) {
              j.checked = false;
              element.arr.push(j);
            }
          });
          let map = {},
            dest = [];
          for (let i = 0; i < element.arr.length; i++) {
            const ai = element.arr[i];
            if (!map[ai.attr_key]) {
              dest.push({
                attr_key: ai.attr_key,
                tran_ctl_desc: ai.tran_ctl_desc,
                radioValue: '',
                ext_attr1: '',
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
          // 处理数组

          dest.forEach(x => {
            this.checkValues.forEach(y => {
              if (x.attr_key === y.attr_key) {
                x.radioValue = y.attr_value;
                x.ext_attr1 = y.ext_attr1;
                x.item.forEach(q => {
                  q.selects = [];
                  if (q.attr_value === y.attr_value) {
                    if (q.ext_source_type === '0') {
                      q.selects = this.getString(q.ext_source_config, 0);
                    } else if (q.ext_source_type === '1') {
                      this.obj = {
                        attr_key: q.attr_key,
                        event: q.attr_value
                      };
                      this.getSelection(q.id);
                    }
                    q.checked = true;
                  } else {
                    q.checked = false;
                  }
                });
                x.checked = true;
              }
            });
          });
          element.arr = dest;
        });
        console.log(this.tabs);


        break;
      case 'batchInsert':



        if (result.returncode === '000000') {
          this.querytext();
          this.notification.create(
            'success',
            '保存成功',
            ''
          );
        }

        break;
      case 'unitsQuery':
        this.units = result.resultdata.bdy.data;
        this.queryattr();
        break;
      case 'queryCheckboxs':


        this.tabs[this.index].arr.forEach(i => {
          if (i.attr_key === this.obj.attr_key) {
            i.item.forEach(j => {
              if (j.attr_value === this.obj.event) {
                j.selects = result.resultdata.bdy;
              }
            });
          }
        });


        break;

    }
  }
  getString(dataStr, index) {
    let objArr;
    if (index === 1) {
      const peopleArr = dataStr.split('|');

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
        objArr.push({ value: str[0].substr(6, str[0].length), name: str[1].substr(4, str[1].length) });

      });
    }

    return objArr;
  }

  rep(arr) {
    let ret;
    ret = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr.indexOf(arr[i]) === i) {
        ret.push(arr[i]);
      }
    }
    return ret;
  }
  selectmonitorChangeEvent(item) {

  }
  monitorChangeEvent(item) {

    if (item) {
      item.forEach(element => {
        this.tabs.forEach(i => {
          if (i.value === element.value) {
            i.isshow = element.checked;
          }
        });
      });
    }
  }
  checkSelectChangeEvent(item) {
    this.tabs.forEach((element, index) => {
      if (element.value === item.value) {
        this.index = index;
      }
    });

  }
  queryattr() {
    TransCommonApiHelper.conditionQuery(this, 'tranattrQuery', {
      tablename: 'btf_tran_attr_dict',
      page: '1',
      pagesize: '999'
    });
  }
  querytext() {
    TransCommonApiHelper.conditionQuery(this, 'unitsQuery', {
      tablename: 'btf_tran_unit',
      page: '1',
      pagesize: '999'
    });
  }

  changeTab(event): void {
    /*if (event !== undefined) {
    }*/
  }
  getCode() {
    TransCommonApiHelper.conditionQuery(this, 'queryCode', {
      tablename: 'btf_tran_attr_ext',
      page: '1',
      pagesize: '999',
      params: [{
        'logic': 'AND',
        'queryList': [{
          'logic': 'AND',
          'operator': 'EQ',
          'params': ['trans_code', this.params.trans_code]
        }]
      }]

    });
  }

  getSelection(item) {
    const obj = {
      dictid: item,
    };
    super.submit('TX500005', 'queryCheckboxs', '', obj);
  }
  radioChange(event, item) {
    this.obj = {
      attr_key: item.attr_key,
      event: event
    };
    item.item.forEach(element => {
      if (element.attr_value === item.radioValue) {
        if (element.ext_source_type === '1') {
          this.getSelection(element.id);
        } else if (element.ext_source_type === '0') {
          element.selects = this.getString(element.ext_source_config, 0);
        }
        element.checked = true;
      } else {
        element.checked = false;
      }
    });


  }
  log(event) {
    if (event.checked) {
      this.obj = {
        attr_key: event.attr_key,
        event: event.attr_value
      };
      if (event.ext_source_type === '1') {
        this.getSelection(event.id);
      } else if (event.ext_source_type === '0') {
        event.selects = this.getString(event.ext_source_config, 0);
      }
    }

  }
  chrcklog(event, item) {
    item.radioValue = event.join(',');
  }
  save() {
    const str = [];
    this.tabs.forEach(i => {
      if (i.isshow === true) {
        i.arr.forEach(j => {
          let string;
          string = j.ext_attr1;
          let flage;
          flage = Object.prototype.toString.call(j.ext_attr1) === '[object Array]';
          if (flage) {
            const objExt = [];
            j.ext_attr1.forEach(x => {
              if (x !== '') {
                objExt.push(x);
              }
            });
            j.ext_attr1 = objExt;
            string = j.ext_attr1.join(',');
          }
          str.push({
            attr_key: j.attr_key,
            trans_code: this.params.trans_code,
            attr_value: j.radioValue,
            tran_config_part: i.value,
            ext_attr1: string
          });
          // }
        });
      }
    });

    const obj = {
      tablename: 'btf_tran_attr_ext',
      deletebyfieldname: 'trans_code',
      deletebyfieldvalue: this.params.trans_code,
      data: str
    };
    console.log(obj);

    super.submit('TX001', 'batchInsert', 'deleteAndInsertBatch', obj);
  }


}
