import {ServiceRequest, ServiceResult} from 'tms-platform';
import {TransactionActionHook} from '../interface/transaction-action.hook';

export class TransactionContext {
  public transCode: string;
  public funcItems: {[key: string]: FuncItem};
  public transactionHook: TransactionActionHook;
  constructor() { }
}
export class FuncItem {
  public serviceRequest: ServiceRequest;
  public serviceResult: ServiceResult;
}
