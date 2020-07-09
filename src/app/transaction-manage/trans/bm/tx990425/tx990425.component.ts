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

const transCode = "tx990425"
const transName = "区块链排序节点"
const tableName = "fabric_orderer"
const exFuncCode = []
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode)
const options = {
  header: [
    {
      key: "app_id",
      label: "应用",
      dictId: "SYS_APP_ID"
    },
    {
      key: "mspid",
      label: "mspid",
      dictId: "USER_MSPID"
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
      key: "properties",
      label: "properties"
    }
  ],
  queryHeader: [
    {
      label: "应用",
      value: "app_id",
      type: "select",
      filedType: "string",
      dictId: "SYS_APP_ID"
    },
    {
      label: "mspid",
      value: "mspid",
      type: "input",
      filedType: "string",
      dictId: "USER_MSPID"
    },
    { label: "domain", value: "domain", type: "input", filedType: "string" },
    {
      label: "location",
      value: "location",
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
  selector: "app-tx990425",
  templateUrl: "./tx990425.component.html",
  styleUrls: ["./tx990425.component.css"]
})
export class Tx990425Component extends CrudTransaction {
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
    this.baseForm.formchangesValue["app_id"] = this.appId
    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb,
      submitEvent: this.submitEvent,
      baseForm: this.baseForm,
      notification: this.notification,
      modelService: this.modelService
    })
  }
  listDataCallback(data: any): void { }
  appId: any
  inputParams(params: any): void {
    this.appId = params
    this.queryModel.staticParams = { app_id: this.appId }
  }
  onAddOrUpdateBefore(event) {
    event.app_id = this.appId
  }
}
