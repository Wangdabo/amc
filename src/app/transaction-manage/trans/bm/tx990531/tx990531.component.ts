import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { IfearmService } from '../../../../service/ifearm.service';
import { BaseTransaction } from '../../base-transaction';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { debounceTime, switchMap } from 'rxjs/internal/operators';
const transCode = 'tx990531';
const transName = '员工信息中心';
const tableName = '';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990531',
  templateUrl: './tx990531.component.html',
  styleUrls: ['./tx990531.component.css']
})
export class Tx990531Component extends BaseTransaction {
  // tslint:disable-next-line: no-input-rename
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>;
  // tslint:disable-next-line: no-output-rename
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }> = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{
    type: string
    transCode: string
    params: any
  }> = new EventEmitter();
  orbitUrl: SafeResourceUrl;
  tabs = [
    { title: '交易列表', index: 0, src: './assets/newimage/Insight/btn_selected.png' },
    { title: '异常事件', index: 1, src: './assets/newimage/Insight/btn_normal.png' },
    { title: '签到记录', index: 2, src: './assets/newimage/Insight/btn_normal.png' },
  ];
  tabIndex = 0;
  translistHead = [{
    key: 'trans_serial_no', label: '交易流水号'
  }, {
    key: 'trans_org', label: '交易网点'
  }, {
    key: 'trans_code', label: '交易代码'
  }, {
    key: 'trans_name', label: '交易名称'
  }, {
    key: 'trans_status', label: '交易状态'
  }, {
    key: 'teller_checker', label: '复核柜员'
  }, {
    key: 'teller_user', label: '授权柜员'
  }, {
    key: 'trans_time', label: '交易执行时长'
  }
  ];
  eventlistHead = [{
    key: 'trans_serial_no', label: '事件编号'
  }, {
    key: 'trans_org', label: '上报网点'
  }, {
    key: 'trans_code', label: '交易代码'
  }, {
    key: 'trans_name', label: '交易名称'
  }, {
    key: 'trans_status', label: '事件状态'
  }, {
    key: 'time', label: '上报时间'
  }, {
    key: 'solution', label: '解决方案'
  }
  ];
  signlistHead = [{
    key: 'sign_date', label: '签到日期'
  }, {
    key: 'partten', label: '模式'
  }, {
    key: 'org', label: '签到工作站'
  }, {
    key: 'sign_user', label: '签到人'
  }, {
    key: 'remarks', label: '备注'
  }
  ];
  dataList: any;
  page = 1; // 当前页数
  total: number; // 总页数
  pageSize = '1'; // 每页个数
  fixedPageSize = '1'; // 当前页数
  isLoading = false;
  rowActions = [{ key: 'info', label: '详情' }];
  optionList: Array<{ value: string; label: string }> = [
    { value: '600001', label: '赵春海' },
    { value: '600002', label: '张三' },
    { value: '600003', label: '李四' },
    { value: '600004', label: '王二' },
  ];
  selectedValue: string;
  ishow = false;
  tableHead: Array<{ key: string; label: string }> = [];
  boxData = [
    { valueToday: '7898', label: '保险', transNum: '100' },
    { valueToday: '7898', label: '贵金', transNum: '100' },
    { valueToday: '7898', label: '理财', transNum: '100' },
    { valueToday: '7898', label: '国债', transNum: '100' },
    { valueToday: '7898', label: '基金', transNum: '100' },
    { valueToday: '7898', label: '定期', transNum: '100' },
    { valueToday: '7898', label: '活期', transNum: '100' },
    { valueToday: '7898', label: '其他', transNum: '100' },

  ]
  constructor(public ifearm: IfearmService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer
  ) {
    super(transCode);
    this.clickTab(0);
  }

  onEnterAfter(): void {

    this.orbitUrl = this.ifearm.monitoringCenter;
    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);

  }
  listDataCallback(data: any): void {
  }


  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    /*let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    ).resultdata;*/
  }
  clickTab(event) {
    this.tabIndex = event;
    switch (this.tabIndex) {
      case 0:
        this.tableHead = this.translistHead;
        this.dataList = [
          // tslint:disable-next-line: max-line-length
          { trans_serial_no: '123482992817', trans_org: '上海浦东新区曹路支行', trans_code: 'TX000001', trans_name: '活期账户转账', trans_status: '正常', teller_checker: '600001', teller_user: '600001', trans_time: '10s' },
          { trans_serial_no: '143182992817', trans_org: '上海浦东新区曹路支行', trans_code: 'TX000002', trans_name: '开卡', trans_status: '正常', teller_checker: '600001', teller_user: '600001', trans_time: '10s' },
          { trans_serial_no: '102382992817', trans_org: '上海浦东新区曹路支行', trans_code: 'TX000003', trans_name: '卡激活', trans_status: '正常', teller_checker: '600001', teller_user: '600001', trans_time: '10s' },
          { trans_serial_no: '102122292817', trans_org: '上海浦东新区曹路支行', trans_code: 'TX000004', trans_name: '签约申请', trans_status: '正常', teller_checker: '600001', teller_user: '600001', trans_time: '10s' },
        ];
        break;
      case 1:
        this.tableHead = this.eventlistHead;
        this.dataList = [
          { trans_serial_no: '123482992817', trans_org: '上海浦东新区曹路支行', trans_code: 'TX000001', trans_name: '活期账户转账', trans_status: '异常', time: '2020-3-9 10:46', solution: '无' },

        ];
        break;
      default:
        this.tableHead = this.signlistHead;
        this.dataList = [
          { sign_date: '2020-3-4 10:48', partten: '指纹', org: '上海浦东新区曹路支行', sign_user: '赵春海', remarks: '无' },
          { sign_date: '2020-3-5 10:48', partten: '指纹', org: '上海浦东新区曹路支行', sign_user: '赵春海', remarks: '无' },
          { sign_date: '2020-3-6 10:48', partten: '指纹', org: '上海浦东新区曹路支行', sign_user: '赵春海', remarks: '无' },
          { sign_date: '2020-3-7 10:48', partten: '指纹', org: '上海浦东新区曹路支行', sign_user: '赵春海', remarks: '无' },
          { sign_date: '2020-3-8 10:48', partten: '指纹', org: '上海浦东新区曹路支行', sign_user: '赵春海', remarks: '无' },
          { sign_date: '2020-3-9 10:48', partten: '指纹', org: '上海浦东新区曹路支行', sign_user: '赵春海', remarks: '无' },
        ];
        break;
    }
  }
  rowActionsHandler($event) {

  }

  // 列表详情翻页
  pageChange($event) {

    this.pageSize = $event.pageIndex.toString();
  }

  search(value: string): void {
    console.log(this.selectedValue);
    if (this.selectedValue === '600001') {
      this.ishow = true;
    } else {
      this.ishow = false;

    }
  }

}
