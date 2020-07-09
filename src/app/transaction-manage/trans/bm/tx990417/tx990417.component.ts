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
import {FormComponent} from "tms-platform-component";
import { SettingService } from "../../../../service/setting.service"

const transCode = "tx990417"
const transName = "区块链用户"
const tableName = "fabric_user"
const exFuncCode = []
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode)
const options = {
  header: [
    {
      key: "type",
      label: "类型", //0 ca管理员 1 节点管理员 2普通用户  ,0，2的时候最后两个不填，1的时候必填
      dictId: "USER_TYPE"
    },
    {
      key: "name",
      label: "用户名称"
    },

    {
      key: "account",
      label: "账户"
    },
    {
      key: "mspid",
      label: "机构",
      dictId: "USER_ORG_MSP_ID"
    },
    {
      key: "affiliation", //type2必填
      label: "部门"
    },
    {
      key: "secret",
      label: "密码" //0的时候必填
    },
    {
      key: "roles",
      label: "角色"
    }
    // {
    //   key: "private_key",
    //   label: "私钥" //0的时候必填
    // },
    // {
    //   key: "certificate",
    //   label: "证书"
    // }
  ],
  queryHeader: [
    { label: "用户名称", value: "name", type: "input", filedType: "string" },
    { label: "账户", value: "account", type: "input", filedType: "string" },
    {
      label: "机构mspid",
      value: "mspid",
      type: "input",
      filedType: "string",
      dictId: "USER_ORG_MSP_ID"
    },
    { label: "部门", value: "affiliation", type: "input", filedType: "string" }
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
  selector: "app-tx990417",
  templateUrl: "./tx990417.component.html",
  styleUrls: ["./tx990417.component.css"]
})
export class Tx990417Component extends CrudTransaction {
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
  app_id: any
  inputParams(params: any): void {
    this.app_id = params
    // this.queryModel.staticParams = { app_id: this.app_id }
  }
  // onAddOrUpdateBefore(event) {
  //   event.app_id = this.app_id
  // }
  isrequired = false
  isaffiliation = true
  issecret = true
  changeValue(event) {
    switch (event.type) {
      case "0":
        this.isrequired = false
        this.isaffiliation = false
        this.issecret = true
        break
      case "1":
        this.isrequired = true
        this.isaffiliation = false
        this.issecret = false
        break
      case "2":
        this.isrequired = false
        this.isaffiliation = true
        this.issecret = false
        break
    }
  }
}
