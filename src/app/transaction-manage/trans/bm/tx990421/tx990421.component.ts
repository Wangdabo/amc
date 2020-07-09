import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from "@angular/core"
import { Transaction } from "../../../decorators/transaction.decorator"
import { TransactionContext } from "../../../context/transaction.context"
import { NzModalService, NzNotificationService } from "ng-zorro-antd"
import { CrudTransaction } from "../../crud-transaction"
import { Observable } from "rxjs"
import { FormComponent} from "tms-platform-component";
import { SettingService } from "../../../../service/setting.service"

const transCode = "tx990421"
const transName = "区块链区块"
const tableName = "fabric_block"
const exFuncCode = []
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode)
const options = {
  header: [
    {
      key: "block_num",
      label: "区块号"
    },
    {
      key: "data_hash",
      label: "数据哈希值"
    },
    {
      key: "block_hash",
      label: "块哈希值"
    },
    {
      key: "pre_data_hash",
      label: "前块数据哈希值"
    },
    {
      key: "pre_block_hash",
      label: "前块哈希值"
    },
    {
      key: "tx_count",
      label: "交易count"
    }
  ],
  queryHeader: [
    { label: "区块号", value: "block_num", type: "input", filedType: "string" },
    {
      label: "数据哈希值",
      value: "data_hash",
      type: "input",
      filedType: "string"
    },
    {
      label: "块哈希值",
      value: "block_hash",
      type: "input",
      filedType: "string"
    },
    {
      label: "前块哈希值",
      value: "pre_block_hash",
      type: "input",
      filedType: "string"
    },
    {
      label: "交易count",
      value: "tx_count",
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
  selector: "app-tx990421",
  templateUrl: "./tx990421.component.html",
  styleUrls: ["./tx990421.component.css"]
})
export class Tx990421Component extends CrudTransaction {
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
    private modelService: NzModalService
  ) {
    super(transCode)
  }
  onEnterAfter(): void {
    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb,
      submitEvent: this.submitEvent,
      baseForm: this.baseForm,
      notification: this.notification,
      modelService: this.modelService
    })
  }
  listDataCallback(data: any): void {}
  inputParams(params: any): void {
    this.queryModel.staticParams = { app_id: params }
  }
}
