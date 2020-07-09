import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core'
import { Transaction } from '../../../decorators/transaction.decorator'
import { TransactionContext } from '../../../context/transaction.context'
import { NzModalService, NzNotificationService } from 'ng-zorro-antd'
import { CrudTransaction } from '../../crud-transaction'
import { Observable } from 'rxjs'
import { FormComponent} from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service'
import { TransCommonApiHelper } from '../../trans-common-api-helper'
import { TransactionContextHelper } from '../../../context/transaction.context.helper'
import { HttpClient } from '@angular/common/http'
import { GlobalService } from 'src/app/service/global.service'

const transCode = 'tx990437'
const transName = '区块链智能合约'
const tableName = 'fabric_chaincode'
const exFuncCode = [
  'queryPeerChannel',
  'addPeer',
  'deletePeer',
  'updatePeer',
  'channel'
]
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode)
const options = {
  header: [
    {
      key: 'app_id',
      label: '应用',
      dictId: 'SYS_APP_ID'
    },
    {
      key: 'name',
      label: '名称'
    },
    {
      key: 'language',
      label: '语言',
      dictId: 'SYS_LANGUAGE' //语言为GO chaincode_path 必填 ，为java时可不填
    },
    {
      key: 'version',
      label: '版本'
    },
    {
      key: 'chaincode_path',
      label: '链码路径'
    },
    {
      key: 'code_path',
      label: '资源路径'
    }
  ],
  queryHeader: [
    {
      label: '应用',
      value: 'app_id',
      type: 'select',
      filedType: 'string',
      dictId: 'SYS_APP_ID'
    },
    { label: '名称', value: 'name', type: 'input', filedType: 'string' },
    { label: '版本', value: 'version', type: 'input', filedType: 'string' },
    {
      label: '链码路径',
      value: 'chaincode_path',
      type: 'input',
      filedType: 'string'
    },
    {
      label: '资源路径',
      value: 'code_path',
      type: 'input',
      filedType: 'string'
    },

    {
      label: '语言',
      value: 'language',
      type: 'select',
      filedType: 'string',
      dictId: 'SYS_LANGUAGE'
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
  selector: 'app-tx990437',
  templateUrl: './tx990437.component.html',
  styleUrls: ['./tx990437.component.css']
})
export class Tx990437Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent
  @ViewChild('baseFormPeer', {static: true})
  baseFormPeer: FormComponent

  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }> = new EventEmitter()
  constructor(
    public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private global: GlobalService
  ) {
    super(transCode)
  }
  onEnterAfter(): void {
    this.queryModel.rowActions[2] = { key: 'peer', label: '安装节点' }
    this.queryModel.rowActions[3] = { key: 'instantiation', label: '实例化' }

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
  inputParams(params: any, appcode: string): void {
    this.appId = params
    this.appcode = appcode
    this.queryModel.staticParams = { app_id: this.appId }
  }

  peerModal = {
    header: [
      {
        key: 'peer_id',
        label: '节点',
        dictId: 'SYS_PEER_ID'
      },
      {
        key: 'chaincode_id',
        label: '智能合约',
        dictId: 'SYS_CHAINCODE_ID'
      },
      {
        key: 'channel_id',
        label: '通道',
        dictId: 'SYS_CHANNEL_ID'
      },
      {
        key: 'chaincode_version',
        label: '智能合约版本'
      }
    ],
    data: [],
    condition: {
      pagesize: 10
    },
    totalCount: 0,
    topActions: [
      { key: 'addPeer', label: '新增' },
      { key: 'install', label: '安装', isHide: false }
    ],
    isLoading: false,
    rowActions: [{ key: 'deletePeer', label: '删除' }],
    isrowEdit: true,
    isOkLoading: false,
    isVisible: false
  }
  chaincodeId: any
  chaincode_version: any
  chaincodeName: string
  isVisible = false
  isInstall = false
  rowActionsHandler(event) {
    this.chaincodeName = event.item.name

    if (event.key === 'peer') {
      this.chaincodeId = event.item.id
      this.chaincode_version = event.item.chaincode_version

      this.getPeerQuery()
    } else if (event.key === 'instantiation') {
      this.isInstall = false
      this.getChannel()
      // this.instantiation.isVisible = true
    } else {
      super.rowActionsHandler(event)
    }
  }
  data = []
  isVisibleChannel = false
  gridStyle = {
    width: '25%',
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
    margin: '0 15px 5px 0'
  }
  onCrudTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result
    let obj
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    )

    if (result.returncode === '000000') {
      switch (tcFuncCode) {
        case 'queryPeerChannel':
          this.queryModel.isLoading = false
          this.peerModal.data = result.resultdata.bdy.data
          this.isVisible = true
          break
        case 'updatePeer':
          this.getPeerQuery()
          break
        case 'deletePeer':
          this.getPeerQuery()
          break
        case 'addPeer':
          this.peerModal.isVisible = false
          this.peerModal.isOkLoading = false
          this.getPeerQuery()
          break
        case 'channel':
          this.data = []
          result.resultdata.bdy.forEach(element => {
            element.checked = false
            this.data.push(element)
          })

          this.peerModal.isLoading = false
          this.isVisibleChannel = true
          break
      }
    } else {
      this.peerModal.isVisible = false
      this.peerModal.isOkLoading = false
    }
  }

  getPeerQuery() {
    this.queryModel.isLoading = true
    TransCommonApiHelper.conditionQuery(this, 'queryPeerChannel', {
      tablename: 'fabric_peer_chaincode',
      page: '1',
      pagesize: '10',
      params: [
        {
          logic: 'AND',
          queryList: [
            {
              logic: 'AND',
              operator: 'EQ',
              params: ['chaincode_id', this.chaincodeId]
            }
          ]
        }
      ]
    })
  }

  topActionsHandlerPeer(event) {
    if (event.key === 'addPeer') {
      this.baseFormPeer.initData()
      this.peerModal.isVisible = true
    } else if (event.key === 'install') {
      if (this.peerIds.length > 0) {
        this.isInstall = true
        this.getChannel()
      } else {
        this.notification.create('warning', '提示', '请选择节点进行安装！')
      }
    }
  }
  getChannel() {
    let obj = {
      app_id: this.appId
    }
    this.peerModal.isLoading = true

    this.submit('TX002', 'channel', 'block_chain.fabricChannelByAppId', obj)
  }
  editActiveHandler(event) {
    console.log(event)

    TransCommonApiHelper.update(this, 'updatePeer', {
      tablename: 'fabric_peer_chaincode',
      data: event
    })
  }

  handleOkAddPeer() {
    // this.baseFormPeer
    this.peerModal.isOkLoading = true
    this.baseFormPeer.formchangesValue['chaincode_id'] = this.chaincodeId
    this.baseFormPeer.formchangesValue[
      'chaincode_version'
    ] = this.chaincode_version

    TransCommonApiHelper.insert(this, 'addPeer', {
      tablename: 'fabric_peer_chaincode',
      data: this.baseFormPeer.formchangesValue
    })
  }
  peerRowActionsHandler(event) {
    console.log(event)

    if (event.key === 'deletePeer') {
      this.modelService.confirm({
        nzTitle: '是否确认删除?',
        nzOkText: '确定',
        nzOkType: 'danger',
        nzOnOk: () => {
          TransCommonApiHelper.delete(this, 'deletePeer', {
            tablename: 'fabric_peer_chaincode',
            id: [event.item.id]
          })
        },

        nzCancelText: '取消',
        nzOnCancel: () => console.log('Cancel')
      })
    }
  }
  onAddOrUpdateBefore(event) {
    event.app_id = this.appId
  }
  ischaincode_path = true
  changeValue(event) {
    if (event.language === '0') {
      this.ischaincode_path = true
    } else {
      this.ischaincode_path = false
    }
  }
  peerIds = []
  selectRowsHandlerPeer(event) {
    console.log(event)
    this.peerIds = []
    event.selectRows.forEach(element => {
      this.peerIds.push(element.id)
    })
  }
  appcode: string
  channelName: string
  checkedChennel(obj) {
    this.channelname = obj.name
    this.data.forEach(element => {
      if (obj.id === element.id) {
        element.checked = element.checked
      } else {
        element.checked = false
      }
    })
  }
  channelname: string
  getInstall() {
    let url = this.global.ipserver + '/blkchain/channel';
    let options = {
      funccode: 'install',
      requestdata: {
        bdy: {
          appcode: this.appcode,
          channelname: this.channelname,
          chaincodename: this.chaincodeName,
          peerids: this.peerIds
        }
      }
    }

    this.peerModal.isLoading = true
    this.http.post(url, options).subscribe(
      res => {
        this.peerModal.isLoading = false
        this.isVisibleChannel = false
        console.log(res)
      },
      errror => {
        this.peerModal.isLoading = false
        console.log(errror)
      }
    )
  }
  args = ''
  instantiation = {
    isVisible: false,
    isOkLoading: false
  }
  getOk() {
    let flage = false
    this.data.forEach(ele => {
      if (ele.checked === true) {
        flage = true
      }
    })
    if (!flage) {
      this.notification.create('warning', '提示', '请选择通道！')
      return
    }
    if (this.isInstall) {
      this.getInstall()
    } else {
      this.getInstantiation()
    }
  }
  getInstantiation() {
    let url = this.global.ipserver + '/blkchain/channel';
    let options = {
      funccode: 'instantiation',
      requestdata: {
        bdy: {
          appcode: this.appcode,
          channelname: this.channelname,
          chaincodename: this.chaincodeName,
          args: this.args
        }
      }
    }

    this.queryModel.isLoading = true
    this.instantiation.isOkLoading = true
    this.http.post(url, options).subscribe(
      res => {
        this.isVisibleChannel = false
        this.queryModel.isLoading = false
        this.instantiation.isOkLoading = false
      },
      errror => {
        this.queryModel.isLoading = false
        console.log(errror)
      }
    )
  }
}
