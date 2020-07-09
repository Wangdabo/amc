import { Component, OnInit,Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { TransCommonApiHelper } from 'src/app/transaction-manage/trans/trans-common-api-helper';
import { BaseTransaction } from 'src/app/transaction-manage/trans/base-transaction';
import { SettingService } from 'src/app/service/setting.service';
import { Observable } from 'rxjs';
import { TransactionContext } from 'src/app/transaction-manage/context/transaction.context';
import { CrudTransaction } from 'src/app/transaction-manage/trans/crud-transaction';
import { Transaction } from 'src/app/transaction-manage/decorators/transaction.decorator';
import { TransactionContextHelper } from 'src/app/transaction-manage/context/transaction.context.helper';

const transCode = 'dashbord';
const transName = '首页';

const funcCode = ['queryCode'];
const options = {

};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options
})
@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.less']
})
export class DashbordComponent extends BaseTransaction {

  text: string;
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
  constructor(public settingService: SettingService,

    private router: Router,

  ) {
    super(transCode);
  }
  styleDiv = {
    padding: '24px 0 0 0',
    border: '3px solid #2570BE',
    borderRadius: '8px',
    margin: ' 2rem 0'
  };
  styleDivChart = {
    padding: '24px 0 0 0',
  };
  temp = false;
  optionsIT = {};
  optionsLine = {};
  topData = [
    { text: '交易', icon: 'pie-chart', index: 0 },
    { text: '员工', icon: 'project', index: 1 },
    { text: '机构', icon: 'team', index: 2 },
  ];
  centerData = [
    {
      icon: 'team',
      text: '员工数',
      value: '79',
      color: {
        backgroundColor: '#F05050'
      }
    },
    {
      icon: 'notification', text: '交易总数', value: '30',
      color: {
        backgroundColor: '#7266ba'
      }
    },
    {
      icon: 'project', text: '机构总数', value: '179',
      color: {
        backgroundColor: '#18bc9c'
      }
    },
    {
      icon: 'pic-right', text: '用户总数', value: '29',
      color: {
        backgroundColor: '#61a0a8'
      }
    }
  ];
  gridStyle = {
    width: '33%',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '18px'
  };
  channel = [];

  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);
    this.getChnnel();

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
    console.log(result);
        break;
    }
  }
  getChnnel(){
    TransCommonApiHelper.conditionQuery(this, 'queryCode', {
      tablename: 'btf_branch_channel',
      page: '1',
      pagesize: '999'
    });
  }
  cardClick(event) {
    console.log(event);
    switch (event.index) {
      case 0:
        this.router.navigate(['aiops/dashbord/transaction/tx990503'], {
          // queryParams: { workGuid: event.guid }
        });
        break;
    }
  }
}
