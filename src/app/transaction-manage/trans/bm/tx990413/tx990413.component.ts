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
import { TransactionContextHelper } from "../../../context/transaction.context.helper"
import { Observable } from "rxjs"
import { FormComponent} from "tms-platform-component";
import { SettingService } from "../../../../service/setting.service"
import { Tx990409Component } from "../tx990409/tx990409.component"
import { TransCommonApiHelper } from "../../trans-common-api-helper"
const transCode = "tx990413"
const transName = "区块链机构"
const tableName = "fabric_org"
const exFuncCode = ["queryPeer", "updatePeer", "deletePeer", "addPeer"]
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode)
const options = {
  header: [
    {
      key: "app_id",
      label: "应用",
      dictId: "SYS_APP_ID"
    },
    {
      key: "name",
      label: "名称"
    },
    {
      key: "domain",
      label: "domain"
    },
    {
      key: "mspid",
      label: "mspid"
    },
    {
      key: "ca_name",
      label: "ca_name"
    },
    {
      key: "ca_location",
      label: "ca_location"
    },
    {
      key: "ca_properties",
      label: "ca_properties"
    }
  ],
  queryHeader: [
    {
      label: "应用",
      value: "app_id",
      type: "select",
      dictId: "SYS_APP_ID",
      filedType: "string"
    },
    { label: "名称", value: "name", type: "input", filedType: "string" },
    { label: "domain", value: "domain", type: "input", filedType: "string" },
    { label: "mspid", value: "mspid", type: "input", filedType: "string" },
    { label: "ca_name", value: "ca_name", type: "input", filedType: "string" },
    {
      label: "ca_location",
      value: "ca_location",
      type: "input",
      filedType: "string"
    },
    {
      label: "ca_properties",
      value: "ca_properties",
      type: "input",
      filedType: "string"
    }
  ],
  tableName: tableName
}
enum ACTIONS {
  ADD,
  UPDATE,
  DELETE,
  BATCH_REMOVE
}
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options,
  subTransCodes: ["tx990409"]
})
@Component({
  selector: "app-tx990413",
  templateUrl: "./tx990413.component.html",
  styleUrls: ["./tx990413.component.css"]
})
export class Tx990413Component extends CrudTransaction {
  @ViewChild("baseForm", {static: true})
  baseForm: FormComponent
  @ViewChild("baseFormPeer", {static: true})
  baseFormPeer: FormComponent
  @ViewChild("tx990409", {static: true})
  tx990409: Tx990409Component
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
    public modelService: NzModalService
  ) {
    super(transCode)
  }
  onEnterAfter(): void {
    this.queryModel.rowActions[2] = { key: "peer", label: "节点维护" }
    // this.baseForm.formchangesValue["app_id"] = this.appId
    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb,
      submitEvent: this.submitEvent,
      baseForm: this.baseForm,
      notification: this.notification,
      modelService: this.modelService
    })
  }
  listDataCallback(data: any): void {}
  appId: any
  inputParams(params: any): void {
    this.appId = params
    this.queryModel.staticParams = { app_id: this.appId }
  }
  isVisible = false

  onCrudTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;
    let obj;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    ).resultdata
    switch (tcFuncCode) {
      case "queryPeer":
        this.queryModel.isLoading = false;
        this.peerModal.data = result.bdy.data;
        this.isVisible = true;
        break;
      case "updatePeer":
        this.getPeerQuery();
        break;
      case "deletePeer":
        this.getPeerQuery();
        break;
      case "addPeer":
        this.peerModal.isVisible = false;
        this.peerModal.isOkLoading = false;
        this.getPeerQuery();
        break
    }
  }

  peerModal = {
    header: [
      {
        key: "mspid",
        label: "mspid",
        isEdit: true
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
    data: [],
    condition: {
      pagesize: 10
    },
    totalCount: 0,
    topActions: [{ key: "addPeer", label: "新增" }],
    isLoading: false,
    rowActions: [
      // { key: ACTIONS.UPDATE, label: "修改" },
      { key: "deletePeer", label: "删除" }
    ],
    isrowEdit: true,
    isVisible: false,
    isOkLoading: false
  }
  mspid: string
  rowActionsHandler(event) {
    if (event.key === "peer") {
      this.mspid = event.item.mspid
      this.getPeerQuery()
    } else {
      super.rowActionsHandler(event)
    }
  }
  getPeerQuery() {
    this.queryModel.isLoading = true
    TransCommonApiHelper.conditionQuery(this, "queryPeer", {
      tablename: "fabric_peer",
      page: "1",
      pagesize: "10",
      params: [
        {
          logic: "AND",
          queryList: [
            {
              logic: "AND",
              operator: "EQ",
              params: ["mspid", this.mspid]
            }
          ]
        }
      ]
    })
  }
  peerRowActionsHandler(event) {
    if (event.key === "deletePeer") {
      this.modelService.confirm({
        nzTitle: "是否确认删除?",
        nzOkText: "确定",
        nzOkType: "danger",
        nzOnOk: () => {
          TransCommonApiHelper.delete(this, "deletePeer", {
            tablename: "fabric_peer",
            id: [event.item.id]
          })
        },

        nzCancelText: "取消",
        nzOnCancel: () => console.log("Cancel")
      })
    }
  }

  selectRowsHandler(event) {}
  pageChange(event) {}
  topActionsHandlerPeer(event) {
    if (event.key === "addPeer") {
      this.baseFormPeer.initData()
      this.peerModal.isVisible = true
    }
  }
  editActiveHandler(event) {
    console.log(event)

    TransCommonApiHelper.update(this, "updatePeer", {
      tablename: "fabric_peer",
      data: event
    })
  }
  handleOkPeer() {
    // this.baseFormPeer
    this.peerModal.isOkLoading = true
    this.baseFormPeer.formchangesValue["mspid"] = this.mspid
    TransCommonApiHelper.insert(this, "addPeer", {
      tablename: "fabric_peer",
      data: this.baseFormPeer.formchangesValue
    })
  }

  onAddOrUpdateBefore(event) {
    event.app_id = this.appId
  }
}
