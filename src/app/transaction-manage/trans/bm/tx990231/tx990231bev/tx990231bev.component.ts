import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../../context/transaction.context';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../../service/setting.service';
import { BaseTransaction } from '../../../base-transaction';
import { OutputAction } from '../../../../interface/custom-action/output.action';
import { ResultData, ServiceResult } from 'tms-platform';
import { TransactionContextHelper } from '../../../../context/transaction.context.helper';
import { TransCommonApiHelper } from '../../../trans-common-api-helper';

const transCode = 'tx990231bev';
const transName = '操作行为';
const tableName = 'btf_transset';
const exFuncCode = ['queryData', 'queryCode', 'insertData'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {


};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options,
})
@Component({
  selector: 'app-tx990231bev',
  templateUrl: './tx990231bev.component.html',
  styleUrls: ['./tx990231bev.component.css']
})
export class Tx990231bevComponent extends BaseTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('params') params: any;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string, transactionContext: TransactionContext
  }>;
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string, tcFuncCode: string, funcCode: string, bdy: any
  }> = new EventEmitter();
  sindex: number;
  tabs: { id: string; text: string; }[];

  constructor(public settingService: SettingService, private notification: NzNotificationService, private cd: ChangeDetectorRef, private message: NzMessageService, ) {
    super(transCode);
  }
  listOfOption = [];
  isVisible = false;
  isOkLoading = false;
  tagValue = [];
  queryModel = {
    data: [],
    condition: {
      pagesize: 0
    },
    totalCount: 0,
    isLoading: false,
    topActions: [{ key: 'add', label: '新增' }],
    rowActions: [{ key: 'del', label: '删除' }],
    header: [
      {
        key: 'bhv_code', label: '操作行为代码'
      }, {
        key: 'bhv_type', label: '操作行为类型'
      }, {
        key: 'bhv_name', label: '操作行为名称'
      }
    ],
  };
  onEnterAfter(): void {

    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    console.log(this.params);
    this.getData();
  }

  customOutput(data: ServiceResult, tcFuncCode: string): void {
    const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);


  }
  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    );

    switch (tcFuncCode) {
      case 'queryData':
        this.queryModel.data = result.resultdata.bdy.data;
        break;
      case 'queryCode':
        console.log(result);
        this.listOfOption = result.resultdata.bdy.data;
        break;
      case 'insertData':
        this.isOkLoading = false;
        if (result.returncode !== '000000') {
          this.message.error(result.returnmessage)
        } else {
          this.isVisible = false;
        }
        console.log(result);
        break;
    }
  }
  getData() {
    super.submit('TX730001', 'queryData', '', this.params);
  }

  topActionsHandler(event) {
    console.log(event);
    if (event.key === 'add') {
      this.isVisible = true;
      this.getCode();
    }
  }
  getCode() {
    TransCommonApiHelper.conditionQuery(this, 'queryCode', {
      tablename: 'btf_trans_bhv',
      page: '1',
      pagesize: '999'
    });
  }
  handleOk() {
    console.log(this.tagValue);
    if (this.tagValue.length > 0) {
      this.isOkLoading = true;
      const obj = {
        transCode: this.params.transCode,
        transBhvSeq: this.tagValue.join(',')
      };
      super.submit('TX730002', 'insertData', '', obj);
    }


  }
  rowActionsHandler(event) {
    console.log(event);
    if (event.key === 'del') {
          
    }
  }
  selectRowsHandler(event) {

  }
  pageChange(event) {

  }
  rowActiveHandler(event) {

  }
}




