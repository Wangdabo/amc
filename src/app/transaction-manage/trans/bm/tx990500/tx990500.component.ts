import { Component, EventEmitter, Input, Output, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { TransCommonApiHelper } from '../../trans-common-api-helper';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';
import { BaseTransaction } from '../../base-transaction';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { HttpClient } from '@angular/common/http';
import * as echarts from 'echarts';
// import ChangeDetectorRef
const transCode = 'tx990500';
const transName = '标签树';
const tableName = '';
const exFuncCode = ['treeQuery', 'updateTree', 'deleteTree', 'addTree'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};

@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990500',
  templateUrl: './tx990500.component.html',
  styleUrls: ['./tx990500.component.css'],
})
export class Tx990500Component extends BaseTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @ViewChild('divchart', {static: true})
  divchart: ElementRef;
  @ViewChild('baseFormAdd', {static: true})
  baseFormAdd: FormComponent;

  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>;
  @Input('params') params: any;
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }> = new EventEmitter();
  constructor(public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private cd: ChangeDetectorRef

  ) {
    super(transCode);
  }
  theme: string;
  temp = false;
  queryHeader = [];
  optionsMap = {};
  pid: string;
  nowId: string;
  objData: any;
  clickData: any;
  chart: any;
  myChart: any;
  upd = {
    isVisible: false,
    isOkLoading: false
  };
  isAdd = false;
  treeForm: any[] = [];
  dbId: string;
  showLoading = false;
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    this.pid = this.params.it.id;
    this.getTreeNode(this.pid);

    this.objData = {
      id: this.params.it.id,
      name: this.params.it.tag_name,
      par_tag_id: this.params.it.par_tag_id,
      tag_name: this.params.it.tag_name,
      is_multiple: this.params.it.is_multiple,
      tag_code: this.params.it.tag_code,
      tag_value: this.params.it.tag_value,
      children: []
    };
    setTimeout(() => {
      this.temp = true;
    });

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
      case 'treeQuery':
        const arr = this.setData(result.bdy);
        this.myChart = echarts.init(this.chart._dom);
        this.optionsMap = {
          title: {
            text: '标签树',
            subtext: 'Tag tree',
            x: 'center',
          },

          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
          },
          series: [
            {
              type: 'tree',
              data: [arr],
              top: '1%',
              left: '7%',
              bottom: '1%',
              right: '20%',
              height: 600,
              symbolSize: 14,
              label: {
                normal: {
                  position: 'left',
                  verticalAlign: 'middle',
                  align: 'right',
                  fontSize: 15
                }
              },

              leaves: {
                label: {
                  normal: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                  }
                }
              },

              expandAndCollapse: true,
              animationDuration: 550,
              animationDurationUpdate: 750
            }
          ]
        };
        this.showLoading = false;
        this.myChart.setOption(this.optionsMap);
        break;
      case 'updateTree':
        this.notification.create('success', '修改成功', '');
        this.upd.isVisible = false;
        this.getTreeNode(this.pid);
        break;
      case 'addTree':
        this.notification.create('success', '新增成功', '');
        this.isAdd = false;
        this.upd.isVisible = false;
        this.getTreeNode(this.pid);

        break;
      case 'deleteTree':
        this.notification.create('success', '删除成功', '');
        this.upd.isVisible = false;
        this.getTreeNode(this.pid);

        break;
    }
  }

  setData(data) {
    let arr = [];
    data.forEach(i => {
      i.children = [];
      i.name = i.tag_name;
      data.forEach(j => {
        if (i.id === j.par_tag_id) {
          i.children.push(j);
        }
      });
    });
    return data[0];
  }


  getTreeNode(id) {
    this.nowId = id;
    this.showLoading = true;
    super.submit('TX500004', 'treeQuery', '', {
      id: id
    });
    // TransCommonApiHelper.conditionQuery(this, 'treeQuery', {
    //   tablename: 'btf_tag_info',
    //   page: '1',
    //   pagesize: '9999',
    //   params: [{
    //     'logic': 'AND',
    //     'queryList': [{
    //       'logic': 'AND',
    //       'operator': 'EQ',
    //       'params': ['par_tag_id', id]
    //     }]
    //   }]

    // });
  }
  chartClick(event) {
    // this.clickData = event;
    if (event.data.is_leaf === true) {
      // this.getTreeNode(event.data.id);
    }
  }
  chartDblClick(event) {
    console.log(event);
    this.dbId = event.data.id;
    // this.baseFormAdd.setValue('par_tag_name', event.data.tag_name);
    // this.baseFormAdd.setValue('par_tag_id', event.data.id);
    // this.baseFormAdd.setValue('tag_name', event.data.tag_name);
    // this.baseFormAdd.setValue('id', event.data.id);
    // this.baseFormAdd.setValue('tag_code', event.data.tag_code);
    // this.baseFormAdd.setValue('tag_value', event.data.tag_value);
    this.baseFormAdd.initData(event.data);
    this.baseFormAdd.disabled('id', true);
    this.baseFormAdd.disabled('par_tag_id', true);
    this.baseFormAdd.disabled('par_tag_name', true);
    this.isAdd = false;
    this.upd.isVisible = true;
  }
  onChartInit(event) {
    this.chart = event;

  }
  buttonClick(event) {
    const obj = this.baseFormAdd.getData();


    if (!this.isAdd) {
      this.treeForm = obj;
    }
    switch (event) {
      case 'add':
        this.isAdd = true;
        this.baseFormAdd.setValue('par_tag_name', obj.tag_name);
        this.baseFormAdd.setValue('par_tag_id', obj.id);
        this.baseFormAdd.setValue('tag_name', null);
        this.baseFormAdd.setValue('tag_code', null);
        this.baseFormAdd.setValue('tag_value', null);
        break;
      case 'save':
        if (this.isAdd) {
          obj.id = null;
          TransCommonApiHelper.insert(this, 'addTree', {
            tablename: 'btf_tag_info',
            data: obj
          });
        } else {
          TransCommonApiHelper.update(this, 'updateTree', {
            tablename: 'btf_tag_info',
            data: obj
          });
        }

        break;
      case 'del':
        if (this.isAdd) {
          this.isAdd = false;
          this.baseFormAdd.initData(this.treeForm);
          console.log(this.treeForm);
        } else {
          this.modelService.confirm({
            nzTitle: '是否确认删除?',
            nzOkText: '确定',
            nzOkType: 'danger',
            nzOnOk: () => {
              TransCommonApiHelper.delete(this, 'deleteTree', {
                tablename: 'btf_tag_info',
                id: [obj.id]
              });
            },
            nzCancelText: '取消',
            nzOnCancel: () => console.log('Cancel')
          });
        }
        break;
    }
  }
}
