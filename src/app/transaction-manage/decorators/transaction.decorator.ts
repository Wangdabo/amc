import { TransactionActionHook } from '../interface/transaction-action.hook';

/**
 * 交易定义模型
 */
export class TransactionDef {
  public name: string;
  public transCode: string;
  public transName: string;
  public funcCode: Array<string>;
  public transClassName: Function;
  public currentTransactionActionHook: TransactionActionHook;
  public options: any;
  public subTransCodes: Array<string>;
}

/**
 * 交易定义池
 */
export const transactionDefPool: { [key: string]: TransactionDef } = {};

/**
 * 交易装饰器,用于装饰交易
 */
export function Transaction(data: {
  transCode: string,
  transName: string, funcCode: Array<string>, options?: any, subTransCodes?: Array<string>
}) {
  return (_constructor: Function) => {
    const transCode = data.transCode;
    const funcCode = data.funcCode;
    const model: TransactionDef = new TransactionDef();
    model.name = _constructor.name;
    model.transClassName = _constructor;
    model.funcCode = funcCode;
    model.transCode = transCode;
    model.transName = data.transName;
    model.options = data.options;
    model.subTransCodes = data.subTransCodes;
    transactionDefPool[transCode] = model;
  };
}



