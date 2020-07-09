import {FuncItem, TransactionContext} from './transaction.context';
import {ServiceRequest, ServiceResult, ServiceTypeEnum} from 'tms-platform';
import {transactionDefPool} from '../decorators/transaction.decorator';

export class TransactionContextHelper {
  public static setServiceResult(tc: TransactionContext, funcCode: string, serviceResult: ServiceResult): void {
    tc.funcItems[funcCode].serviceResult = serviceResult;
  }
  public static getServiceResult(tc: TransactionContext, funcCode: string, transCode?: string): ServiceResult {
    if (transCode) {
      return tc.funcItems[TransactionContextHelper.formatFuncCode(transCode, funcCode)].serviceResult;
    } else {
      return tc.funcItems[funcCode].serviceResult;
    }
  }
  public static setServiceRequest(tc: TransactionContext, tcFuncCode, funcCode, svcCode, bdy): void {
    tc.funcItems[tcFuncCode].serviceRequest.funccode = funcCode;
    tc.funcItems[tcFuncCode].serviceRequest.svccode = svcCode;
    tc.funcItems[tcFuncCode].serviceRequest.requestdata.bdy = bdy;
  }
  public static getServiceRequest(tc: TransactionContext, funcCode: string): ServiceRequest {
    return tc.funcItems[funcCode].serviceRequest;
  }
  public static newFuncItem() {
    const instance = new FuncItem();
    instance.serviceRequest = {svccode: '', svctype: ServiceTypeEnum.TRANSACTION, funccode: '', requestdata: {coh:{}, bdy: {}}};
    return instance;
  }
  public static formatFuncCode(transCode: string, funcCode: string): string {
    const def = transactionDefPool[transCode];
    return funcCode + '$' + def.name;
  }
  public static parseFuncCode(funcCode: string): {name: string, funcCode: string} {
    return {funcCode: funcCode.split('$')[0], name: funcCode.split('$')[1]};
  }
}
