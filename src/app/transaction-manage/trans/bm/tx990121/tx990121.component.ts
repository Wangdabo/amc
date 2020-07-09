import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from "@angular/core"
import { Transaction } from "../../../decorators/transaction.decorator"
import { TransactionContext } from "../../../context/transaction.context"
import { NzModalService, NzNotificationService } from "ng-zorro-antd"
import { CrudTransaction } from "../../crud-transaction"
import { Observable } from "rxjs"
import { SettingService } from "../../../../service/setting.service"
import { DatePipe } from "@angular/common"
import { FormComponent} from "tms-platform-component";

const transCode = "tx990121"
const transName = "错误码参数维护"
const tableName = "btf_retcode"
const exFuncCode = []
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode)
const options = {
  header: [
    {
      key: "ret_code",
      label: "错误码"
    },
    {
      key: "host_code",
      label: "主机业务系统"
    },
    {
      key: "ret_exp",
      label: "错误码说明"
    },
    {
      key: "description",
      label: "错误码描述"
    }
  ],
  queryHeader: [
    { label: "错误码", value: "ret_code", type: "input", filedType: "string" },
    {
      label: "主机业务系统",
      value: "host_code",
      type: "input",
      filedType: "string"
    },
    {
      label: "错误码说明",
      value: "ret_exp",
      type: "input",
      filedType: "string"
    },
    {
      label: "错误码描述",
      value: "description",
      type: "input",
      filedType: "string"
    }
  ],
  tableName: tableName
}
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options
})
@Component({
  selector: "app-tx990121",
  templateUrl: "./tx990121.component.html",
  styleUrls: ["./tx990121.component.css"]
})
export class Tx990121Component extends CrudTransaction {
  @ViewChild("baseForm", {static: true})
  baseForm: FormComponent
  @Input("transactionContextChangeOb") transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>
  @Output("submitEvent") submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }> = new EventEmitter()
  constructor(
    public settingService: SettingService,
    private notification: NzNotificationService,
    private datePipe: DatePipe,
    private modelService: NzModalService
  ) {
    super(transCode)
  }
  onEnterAfter(): void {
    console.log('初始化');

    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb,
      submitEvent: this.submitEvent,
      baseForm: this.baseForm,
      notification: this.notification,
      modelService: this.modelService
    })
  }
  listDataCallback(data: any): void {}

  onAddOrUpdateBefore(submitData: any): any {}
}
