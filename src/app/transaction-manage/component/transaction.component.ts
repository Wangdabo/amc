import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsaApi, CommandApi } from 'tms-platform';
import { TransactionContext } from '../context/transaction.context';
import { TransactionAction } from '../interface/transaction.action';
import { TransactionDef } from '../decorators/transaction.decorator';
import { Observable, Subject, Subscription } from 'rxjs';
import { TransactionContextHelper } from '../context/transaction.context.helper';
import { TransactionActionHook } from '../interface/transaction-action.hook';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.less']
})
export class TransactionComponent implements OnInit, TransactionAction, OnDestroy {
  public static SON_ROUTE_EVENT_TYPE_SKIP = 'skip';
  public static SON_ROUTE_EVENT_TYPE_BACK = 'back';
  caller = this;
  dynmicTrans: string;
  isBack: boolean;
  currentTransactionDef: TransactionDef;
  transactionContextChangeOb: Observable<{ tcFuncCode: string, transactionContext: TransactionContext }>;
  subTransInputParams: any;
  oldTransDef: TransactionDef;
  tabs = [ 1, 2, 3 ];
  private transactionContextChangeSub: Subject<{ tcFuncCode: string, transactionContext: TransactionContext }>;
  private transactionContext: TransactionContext;
  private transCode: string;
  constructor(
    private commandApi: CommandApi,
    private bsaApi: BsaApi,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef) {
  }

  setTransactionContextChangeSub(value: Subject<{ tcFuncCode: string, transactionContext: TransactionContext }>): void {
    this.transactionContextChangeSub = value;
  }
  setTransactionContextChangeOb(value: Observable<{ tcFuncCode: string, transactionContext: TransactionContext }>): void {
    this.transactionContextChangeOb = value;
  }
  setSubTransInputParams(value: any): void {
    this.subTransInputParams = value;
  }
  setOldTransDef(value: TransactionDef): void {
    this.oldTransDef = value;
  }
  getOldTransDef(): TransactionDef {
    return this.oldTransDef;
  }
  getDynmicTrans(): string {
    return this.dynmicTrans;
  }

  setDynmicTrans(value: string) {

    this.dynmicTrans = value;
  }
  getIsBack(): boolean {
    return this.isBack;
  }

  setIsBack(value: boolean) {
    this.isBack = value;
  }

  getCurrentTransactionDef(): TransactionDef {
    return this.currentTransactionDef;
  }

  setCurrentTransactionDef(value: TransactionDef) {
    this.currentTransactionDef = value;
  }

  getTransactionContext(): TransactionContext {
    return this.transactionContext;
  }

  setTransactionContext(value: TransactionContext) {
    this.transactionContext = value;
  }

  setTransactionContextServiceResult(tcFuncCode, data) {
    TransactionContextHelper.setServiceResult(this.transactionContext, tcFuncCode, data);
    this.transactionContextChangeSub.next({ tcFuncCode: tcFuncCode, transactionContext: this.transactionContext });
    // 手动触发ng脏检查
    this.cd.markForCheck();
  }
  setTransactionContextServiceRequest(tcFuncCode, funcCode, svcCode, bdy) {
    TransactionContextHelper.setServiceRequest(this.transactionContext, tcFuncCode, funcCode, svcCode, bdy);
  }
  setTransactionHook(hook: TransactionActionHook) {
    this.transactionContext.transactionHook = hook;
  }
  getTransCode(): string {
    return this.transCode;
  }

  setTransCode(value: string) {
    this.transCode = value;
  }

  navbarType: string;
  ngOnInit() {
    this.enter();

    const identification = location.hash.substring(2, 3);
    if (identification === 'a') {
      this.navbarType = 'aiops';
    } else {
      this.navbarType = 'GOV';
    }
  }
  /**
   * 进入组件
   */
  enter() {

    const cmdData = {
      refReadonlyProps: {
        activatedRoute: this.activatedRoute,
        router: this.router
      },
      refGetSetFuncs: {
        setIsBack: this.setIsBack.bind(this),
        setTransCode: this.setTransCode.bind(this),
        setCurrentTransactionDef: this.setCurrentTransactionDef.bind(this),
        setDynmicTrans: this.setDynmicTrans.bind(this),
        setTransactionContext: this.setTransactionContext.bind(this),
        getTransactionContext: this.getTransactionContext.bind(this),
        setTransactionHook: this.setTransactionHook.bind(this),
        setTransactionContextChangeOb: this.setTransactionContextChangeOb.bind(this),
        setTransactionContextChangeSub: this.setTransactionContextChangeSub.bind(this),
      }
    };
    this.commandApi.execute('enter', cmdData);
  }
  /**
   * 提交交易
   */
  submit(data: { svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }) {
    const cmdData = {
      params: {
        svcCode: data.svcCode,
        tcFuncCode: data.tcFuncCode,
        funcCode: data.funcCode,
        bdy: data.bdy,
      },
      refReadonlyProps: {
        bsaApi: this.bsaApi,
      },
      refGetSetFuncs: {
        getTransactionContext: this.getTransactionContext.bind(this),
        getCurrentTransactionDef: this.getCurrentTransactionDef.bind(this),
        setTransactionContextServiceResult: this.setTransactionContextServiceResult.bind(this),
        setTransactionContextServiceRequest: this.setTransactionContextServiceRequest.bind(this),
      }
    };
    this.commandApi.execute('submit', cmdData);
  }
  submitEventHandler(event: { svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }) {
    this.submit(event);
  }

  /**
   * 跳转子路由
   * @param {any} string
   * @param {any} any
   */
  sonRouteSkip(data: { transCode?: string, params?: any }) {
    const cmdData = {
      params: {
        oldTransDef: this.currentTransactionDef,
        transCode: data.transCode,
        subParams: data.params
      },
      refGetSetFuncs: {
        setTransCode: this.setTransCode.bind(this),
        setCurrentTransactionDef: this.setCurrentTransactionDef.bind(this),
        setDynmicTrans: this.setDynmicTrans.bind(this),
        setTransactionContext: this.setTransactionContext.bind(this),
        getTransactionContext: this.getTransactionContext.bind(this),
        setTransactionHook: this.setTransactionHook.bind(this),
        setTransactionContextChangeOb: this.setTransactionContextChangeOb.bind(this),
        setTransactionContextChangeSub: this.setTransactionContextChangeSub.bind(this),
        setSubTransInputParams: this.setSubTransInputParams.bind(this),
        setOldTransDef: this.setOldTransDef.bind(this),
      }
    };
    this.commandApi.execute('skipSonRoute', cmdData);
  }

  /**
   * 返回上级
   */
  sonRouteBack(): void {
    const cmdData = {
      refGetSetFuncs: {
        getOldTransDef: this.getOldTransDef.bind(this),
        setTransCode: this.setTransCode.bind(this),
        setCurrentTransactionDef: this.setCurrentTransactionDef.bind(this),
        setDynmicTrans: this.setDynmicTrans.bind(this),
        setTransactionContext: this.setTransactionContext.bind(this),
        getTransactionContext: this.getTransactionContext.bind(this),
        setTransactionHook: this.setTransactionHook.bind(this),
        setTransactionContextChangeOb: this.setTransactionContextChangeOb.bind(this),
        setTransactionContextChangeSub: this.setTransactionContextChangeSub.bind(this),
        setOldTransDef: this.setOldTransDef.bind(this),
      }
    };
    this.commandApi.execute('backOldRoute', cmdData);
  }
  sonRouteEventHandler(event: { type: string, transCode?: string, params?: any }) {
    if (event.type === TransactionComponent.SON_ROUTE_EVENT_TYPE_BACK) {
      this.sonRouteBack();
    } else if (event.type === TransactionComponent.SON_ROUTE_EVENT_TYPE_SKIP) {
      this.sonRouteSkip({ transCode: event.transCode, params: event.params });
    }
  }
  ngOnDestroy(): void {
  }

  back(): void {
    history.go(-1);
  }
  closeTab(event) {

  }
}
