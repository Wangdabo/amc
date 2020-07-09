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
import { IfearmService } from 'src/app/service/ifearm.service';
const transCode = 'tx990511';
const transName = '趋势分析';
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
  selector: 'app-tx990511',
  templateUrl: './tx990511.component.html',
  styleUrls: ['./tx990511.component.css'],
})
export class Tx990511Component extends BaseTransaction {
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
  img = this.ifearm.imgSrc;

  constructor(public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private router: Router,
    private ifearm: IfearmService


  ) {
    super(transCode);
  }
  temp = false;
  data = [
    {
      title: ' 对北京地区存款业务量趋势的检测',
      benchmark: '历史平均',
      type: '存款、理财',
      address: '北京',
      status: '成功'
    },
    {
      title: ' 对北京地区存款业务量趋势的检测',
      benchmark: '历史平均',
      type: '存款、理财',
      adress: '北京',
      status: '成功'
    }, {
      title: ' 对北京地区存款业务量趋势的检测',
      benchmark: '历史平均',
      type: '存款、理财',
      adress: '北京',
      status: '成功'
    }
  ];
  optionsMap = {};
  queryModel = {
    data: [],
    condition: {
      pagesize: 0
    },
    topActions: [],
    rowActions: [],
    totalCount: 0,
    isLoading: false,
    header: [
      {
        key: 'customer_name',
        label: '省市（合计）'
      },
      {
        key: 'customer_tel',
        label: '存款业务'
      },
      {
        key: 'sex',
        label: '贷款业务',
      },
      {
        key: 'sex',
        label: '理财业务',
      }
    ],
  };



  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);

  }








  listDataCallback(data: any): void {
  }

  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    /*  let result;
      result = TransactionContextHelper.getServiceResult(
        transactionContext,
        tcFuncCode,
        transCode
      ).resultdata;*/
    //   switch (tcFuncCode) {
    //     case 'app':
    //       break;
    //   }
  }
  imgAdd() {

  }
  imgIcon() {
    super.skipSonRoute('tx990512', {
    });

  }
}
