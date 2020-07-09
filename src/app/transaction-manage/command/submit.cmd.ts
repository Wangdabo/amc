import { BaseCmd, Cmd, ServiceResult } from "tms-platform"
import { Observable } from "rxjs"
import {
  instanceOfOutputAction,
  OutputAction
} from "../interface/custom-action/output.action"

@Cmd("submit")
export class SubmitCmd extends BaseCmd {
  getTransactionContext
  getCurrentTransactionDef
  setTransactionContextServiceResult
  setTransactionContextServiceRequest
  bsaApi
  execute(data: {
    refGetSetFuncs: any
    refReadonlyProps: any
    params?: any
  }): void {

    const tcFuncCode = data.params.tcFuncCode
    const funcCode = data.params.funcCode
    const svcCode = data.params.svcCode
    const bdy = data.params.bdy
    this.bsaApi = data.refReadonlyProps.bsaApi
    this.getTransactionContext = data.refGetSetFuncs.getTransactionContext
    this.getCurrentTransactionDef = data.refGetSetFuncs.getCurrentTransactionDef
    this.setTransactionContextServiceResult =
      data.refGetSetFuncs.setTransactionContextServiceResult
    this.setTransactionContextServiceRequest =
      data.refGetSetFuncs.setTransactionContextServiceRequest
    // 设置上下文请求参数
    this.setTransactionContextServiceRequest(tcFuncCode, funcCode, svcCode, bdy)
    // 执行钩子函数
    if (this.getTransactionContext().transactionHook.onSubmitBefore()) {
      // 调用功能
      this.call(tcFuncCode).subscribe(retData => {
        this.setTransactionContextServiceResult(tcFuncCode, retData)
        if (
          instanceOfOutputAction(this.getTransactionContext().transactionHook)
        ) {
          // 调用输出行为
          ; (<OutputAction>(
            (this.getTransactionContext().transactionHook as any)
          )).customOutput(retData, tcFuncCode)
        } else {
          // 默认输出行为
          this.output(retData)
        }
      })
    }
  }

  private output(data: any): void {
    // console.log('output:' + JSON.stringify(data));
  }

  private call(tcFuncCode: string): Observable<ServiceResult> {
    return this.bsaApi.asynCall(
      this.getTransactionContext().funcItems[tcFuncCode].serviceRequest
    )
  }
}
