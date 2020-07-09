import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { BaseTransaction } from '../../base-transaction';
import { Observable } from 'rxjs';
import { FormComponent} from "tms-platform-component";
import { SettingService } from '../../../../service/setting.service';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { ResultData, ServiceResult } from 'tms-platform';
import { DatePipe } from '@angular/common';
import { element } from 'protractor';
import { Params } from '@angular/router';
import { Tx990405Component } from '../tx990405/tx990405.component';
import { Tx990413Component } from '../tx990413/tx990413.component';
import { Tx990437Component } from '../tx990437/tx990437.component';
import { Tx990417Component } from '../tx990417/tx990417.component';
import { Tx990425Component } from '../tx990425/tx990425.component';
const transCode = 'tx990442';
const transName = '区块链维护';
const tableName = 'fabric_peer_channel';
const funcCode = [];

@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  subTransCodes: ['tx990405', 'tx990413', 'tx990437', 'tx990417', 'tx990425']
})
@Component({
  selector: 'app-tx990442',
  templateUrl: './tx990442.component.html',
  styleUrls: ['./tx990442.component.css']
})
export class Tx990442Component extends BaseTransaction {
  //  继承父类
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @ViewChild('tx990405', {static: true})
  tx990405: Tx990405Component;
  @ViewChild('tx990413', {static: true})
  tx990413: Tx990413Component;
  @ViewChild('tx990437', {static: true})
  tx990437: Tx990437Component;
  @ViewChild('tx990417', {static: true})
  tx990417: Tx990417Component;
  @ViewChild('tx990425', {static: true})
  tx990425: Tx990425Component;
  @ViewChild('divChild', {static: true}) divChild: ElementRef;
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
  constructor(
    private datePipe: DatePipe,
    public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService
  ) {
    super(transCode);
  }
  appData: any[] = [];
  appDataChildren: any[] = [];
  dateArrayHour: any[] = [];
  dateArrayMin: any[] = [];
  channelName: string;
  appName: string;
  appId: number;
  appcode: string;
  tabs = [
    { title: '通道', index: 0 },
    { title: '机构', index: 1 },
    { title: '智能合约', index: 2 },
    { title: '用户', index: 3 },
    { title: '排序节点', index: 4 }
  ];
  //  初始化
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    //  this.getApp()
    //  this.channelId = this.params.channelId
    this.appId = this.params.appId;
    //  this.channelName = this.params.channelName
    this.appName = this.params.appName;
    this.appcode = this.params.appcode;
    this.tabSelect(0);
  }
  listDataCallback(data: any): void { }
  //    loadData = this.loadDataing.bind(this)
  // 父级方法

  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);
    console.log(parse);

    if (parse.name === Tx990405Component.name) {
      this.tx990405.onTransactionContextChange(
        parse.funcCode,
        transactionContext,
        'tx990405'
      );
      return;
    }
    if (parse.name === Tx990413Component.name) {
      this.tx990413.onTransactionContextChange(
        parse.funcCode,
        transactionContext,
        'tx990413'
      );
      return;
    }
    if (parse.name === Tx990437Component.name) {
      this.tx990437.onTransactionContextChange(
        parse.funcCode,
        transactionContext,
        'tx990437'
      );
      return;
    }
    if (parse.name === Tx990417Component.name) {
      this.tx990417.onTransactionContextChange(
        parse.funcCode,
        transactionContext,
        'tx990417'
      );
      return;
    }
    if (parse.name === Tx990425Component.name) {
      this.tx990425.onTransactionContextChange(
        parse.funcCode,
        transactionContext,
        'tx990425'
      );
      return;
    }

   /* let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    ).resultdata;
    console.log(tcFuncCode);*/

    switch (tcFuncCode) {
      case 'app':
        break;
    }
  }
  customOutput(data: ServiceResult, funcCode: string): void {
    const parse = TransactionContextHelper.parseFuncCode(funcCode);
    if (parse.name === Tx990405Component.name) {
      this.tx990405.customOutput(data, parse.funcCode);
      return;
    }
    if (parse.name === Tx990413Component.name) {
      this.tx990413.customOutput(data, parse.funcCode);
      return;
    }
    if (parse.name === Tx990437Component.name) {
      this.tx990437.customOutput(data, parse.funcCode);
      return;
    }
    if (parse.name === Tx990417Component.name) {
      this.tx990417.customOutput(data, parse.funcCode);
      return;
    }
    if (parse.name === Tx990425Component.name) {
      this.tx990425.customOutput(data, parse.funcCode);
      return;
    }
  }

  tabSelect(event) {
    console.log(event);
    switch (event) {
      case 0:
        this.tx990405.inputParams(this.appId, this.appName, this.appcode);
        this.tx990405.onEnterAfter();

        break;
      case 1:
        this.tx990413.inputParams(this.appId);
        this.tx990413.onEnterAfter();

        break;
      case 2:
        this.tx990437.inputParams(this.appId, this.appcode);
        this.tx990437.onEnterAfter();

        break;
      case 3:
        this.tx990417.inputParams(this.appId);
        this.tx990417.onEnterAfter();

        break;
      case 4:
        this.tx990425.inputParams(this.appId);
        this.tx990425.onEnterAfter();

        break;
    }
  }
  submitTx990405EventHandler(event: {
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }) {
    super.submit(
      event.svcCode,
      TransactionContextHelper.formatFuncCode('tx990405', event.tcFuncCode),
      event.funcCode,
      event.bdy
    );
    console.log(event);
  }
  submitTx990413EventHandler(event: {
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }) {
    super.submit(
      event.svcCode,
      TransactionContextHelper.formatFuncCode('tx990413', event.tcFuncCode),
      event.funcCode,
      event.bdy
    );
    console.log(event);
  }
  submitTx990437EventHandler(event: {
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }) {
    super.submit(
      event.svcCode,
      TransactionContextHelper.formatFuncCode('tx990437', event.tcFuncCode),
      event.funcCode,
      event.bdy
    );
    console.log(event);
  }
  submitTx990417EventHandler(event: {
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }) {
    super.submit(
      event.svcCode,
      TransactionContextHelper.formatFuncCode('tx990417', event.tcFuncCode),
      event.funcCode,
      event.bdy
    );
    console.log(event);
  }
  submitTx990425EventHandler(event: {
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }) {
    super.submit(
      event.svcCode,
      TransactionContextHelper.formatFuncCode('tx990425', event.tcFuncCode),
      event.funcCode,
      event.bdy
    );
    console.log(event);
  }
}
