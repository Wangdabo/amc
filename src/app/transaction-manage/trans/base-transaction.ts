import {TransactionActionHook} from '../interface/transaction-action.hook';
import {TransactionDef, transactionDefPool} from '../decorators/transaction.decorator';
import {Observable} from 'rxjs';
import {TransactionContext} from '../context/transaction.context';
import {EventEmitter} from '@angular/core';
import {TransactionComponent} from '../component/transaction.component';
import {OutputAction} from '../interface/custom-action/output.action';
import {ServiceResult} from 'tms-platform';

export abstract class BaseTransaction implements TransactionActionHook , OutputAction{
  protected transactionDef: TransactionDef;
  private _transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>;
  private _submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}>;
  private _sonRouteSkipEvent:  EventEmitter<{type: string, transCode?: string, params?: any}>;
  constructor(transCode: string) {
    this.transactionDef = transactionDefPool[transCode];
    this.transactionDef.currentTransactionActionHook = this;
  }
  initBase(transactionContextChangeOb: Observable<{tcFuncCode: string, transactionContext: TransactionContext}>,
       submitEvent: EventEmitter<{svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}>,
           sonRouteSkipEvent?: EventEmitter<{type: string, transCode?: string, params?: any}>): void {
    this._transactionContextChangeOb = transactionContextChangeOb;
    this._submitEvent = submitEvent;
    this._sonRouteSkipEvent = sonRouteSkipEvent;
    if (this._transactionContextChangeOb) {
      // 子交易无需监听上下文变化，交给父交易处理
      this._transactionContextChangeOb.subscribe(data => {
        this.onTransactionContextChange(data.tcFuncCode, data.transactionContext);
      });
    }
  }
  public submit(svcCode: string, tcFuncCode: string, funcCode: string, bdy: any): void {
    this._submitEvent.emit({svcCode, tcFuncCode, funcCode, bdy});
  }
  public skipSonRoute(transCode: string, params?: any): void {
    this._sonRouteSkipEvent.emit({type: TransactionComponent.SON_ROUTE_EVENT_TYPE_SKIP, transCode, params});
  }
  public backSonRoute(): void {
    this._sonRouteSkipEvent.emit({type: TransactionComponent.SON_ROUTE_EVENT_TYPE_BACK});
  }
  onEnterAfter(): void {
  }
  onSubmitBefore(): boolean {
    return true;
  }
  customOutput(data: ServiceResult, funcCode: string): void {
  }
  public abstract onTransactionContextChange(tcFuncCode: string, transactionContext: TransactionContext, transCode?: string);
}
