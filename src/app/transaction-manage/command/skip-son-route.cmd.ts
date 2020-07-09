import {BaseCmd, Cmd} from 'tms-platform';
import {TransactionDef, transactionDefPool} from '../decorators/transaction.decorator';
import {TransactionContext} from '../context/transaction.context';
import {Subject} from 'rxjs';
import {TransactionContextHelper} from '../context/transaction.context.helper';

@Cmd('skipSonRoute')
export class SkipSonRouteCmd extends BaseCmd {
  transCode; oldTransDef; subParams; setTransCode; setOldTransDef; setSubTransInputParams; setSubscription;
  setCurrentTransactionDef; setDynmicTrans; setTransactionContext; getTransactionContext; setTransactionHook;
  setTransactionContextChangeOb; setTransactionContextChangeSub;

  execute(data: {refGetSetFuncs: any, refReadonlyProps: any, params?: any}): void {
    this.transCode = data.params.transCode;
    this.oldTransDef = data.params.oldTransDef;
    this.subParams = data.params.subParams;
    this.setTransCode = data.refGetSetFuncs.setTransCode;
    this.setSubscription = data.refGetSetFuncs.setSubscription;
    this.setCurrentTransactionDef = data.refGetSetFuncs.setCurrentTransactionDef;
    this.setDynmicTrans = data.refGetSetFuncs.setDynmicTrans;
    this.setTransactionContext = data.refGetSetFuncs.setTransactionContext;
    this.getTransactionContext = data.refGetSetFuncs.getTransactionContext;
    this.setTransactionHook = data.refGetSetFuncs.setTransactionHook;
    this.setTransactionContextChangeOb = data.refGetSetFuncs.setTransactionContextChangeOb;
    this.setTransactionContextChangeSub = data.refGetSetFuncs.setTransactionContextChangeSub;

    this.setOldTransDef = data.refGetSetFuncs.setOldTransDef;
    this.setSubTransInputParams = data.refGetSetFuncs.setSubTransInputParams;
    // 初始化成员变量
    this.setTransCode(this.transCode);
    this.setOldTransDef(this.oldTransDef);
    this.setSubTransInputParams(this.subParams);
    const sub = new Subject();
    this.setTransactionContextChangeSub(sub);
    this.setTransactionContextChangeOb(sub.asObservable());
    // 加载交易
    this.loadTrans(this.transCode);
  }

  /**
   * 加载交易
   */
  private loadTrans(transCode): void {
    // 选择交易
    const def: TransactionDef = transactionDefPool[transCode];
    // 动态渲染交易组件
    this.setDynmicTrans(def.transClassName);
    this.setCurrentTransactionDef(def);
    // 初始化交易上下文
    this.initContext(def, transCode);
    // 调用行为钩子,使用timout让动态组件先加载
    setTimeout(() => {
      this.setTransactionHook(def.currentTransactionActionHook);
      this.getTransactionContext().transactionHook.onEnterAfter();
    });
  }

  /**
   * 初始化上下文对象
   */
  private initContext(def, transCode): void {
    const transactionContext = new TransactionContext();
    transactionContext.transCode = transCode;
    transactionContext.funcItems = {};
    def.funcCode.forEach(value => {
      transactionContext.funcItems[value] = TransactionContextHelper.newFuncItem();
    });
    if (def.subTransCodes && def.subTransCodes.length > 0) {
      // 初始化子交易funcitem，funccode默认拼上name
      def.subTransCodes.forEach(subTransCode => {
        // 拿子交易定义
        const subTransactionDef = transactionDefPool[subTransCode];
        subTransactionDef.funcCode.forEach(subValue => {
          transactionContext.funcItems[TransactionContextHelper.formatFuncCode(subTransCode, subValue)]
            = TransactionContextHelper.newFuncItem();
        });
      });
    }
    this.setTransactionContext(transactionContext);
  }
}
