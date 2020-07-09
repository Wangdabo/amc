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

const transCode = "tx990409"
const transName = "区块链节点"
const tableName = "fabric_peer"
const exFuncCode = []
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode)
const options = {
  header: [
    {
      key: "mspid",
      label: "mspid"
    },
    {
      key: "domain",
      label: "domain"
    },
    {
      key: "location",
      label: "location"
    },
    {
      key: "event_hub",
      label: "event_hub"
    },
    {
      key: "properties",
      label: "properties"
    }
  ],
  queryHeader: [
    { label: "mspid", value: "mspid", type: "input", filedType: "string" },
    { label: "domain", value: "domain", type: "input", filedType: "string" },
    {
      label: "location",
      value: "location",
      type: "input",
      filedType: "string"
    },
    {
      label: "event_hub",
      value: "event_hub",
      type: "input",
      filedType: "string"
    },
    {
      label: "properties",
      value: "properties",
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
  selector: "app-tx990409",
  templateUrl: "./tx990409.component.html",
  styleUrls: ["./tx990409.component.css"]
})
export class Tx990409Component extends CrudTransaction {
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
  listDataCallback(data: any): void { }
  inputParams(params: any): void {
    this.queryModel.staticParams = { mspid: params }
  }
}
