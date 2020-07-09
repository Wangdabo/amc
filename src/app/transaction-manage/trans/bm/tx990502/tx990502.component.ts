import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';
import { TransCommonApiHelper } from '../../trans-common-api-helper';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { BsaApi } from 'tms-platform';

const transCode = 'tx990502';
const transName = '区块链黑名单';
const tableName = '';
const exFuncCode = ['query'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options
})
@Component({
  selector: 'app-tx990502',
  templateUrl: './tx990502.component.html',
  styleUrls: ['./tx990502.component.css'],
})
export class Tx990502Component extends CrudTransaction {

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
  constructor(public settingService: SettingService,
    private notification: NzNotificationService, private modelService: NzModalService, private bsaApi: BsaApi, ) {
    super(transCode);
  }
  data = [];
  gridStyle = {
    width: '20%',
    textAlign: 'center',
    cursor: 'pointer'
  };
  option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line'
    }]
  };




  onEnterAfter(): void {
    const serviceRequest = {
      'funccode': 'query',
      'svccode': 'TX20003',
      'svctype': '0',
      'requestdata': {
        'bdy': {},
        'coh': {
          'chlno': '',
          'usercode': ''
        }
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      console.log(data);
      this.data = data.resultdata.bdy;

    });
  }
  listDataCallback(data: any): void {
  }
}
