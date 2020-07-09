import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent} from "tms-platform-component";
import { SettingService } from '../../../../service/setting.service';
import { TransCommonApiHelper } from '../../trans-common-api-helper';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from 'src/app/service/global.service';

const transCode = 'tx990405';
const transName = '区块链通道';
const tableName = 'fabric_channel';
const exFuncCode = ['queryPeerChannel', 'addPeer', 'deletePeer', 'updatePeer'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [
    {
      key: 'app_id',
      label: '应用',
      dictId: 'SYS_APP_ID'
    },
    {
      key: 'name',
      label: '通道名称'
    },
    {
      key: 'mspid',
      label: '创建者mspid'
    },
    {
      key: 'tx_path',
      label: '交易配置文件路径'
    }
  ],
  queryHeader: [
    {
      label: '应用',
      value: 'app_id',
      type: 'select',
      dictId: 'SYS_APP_ID',
      filedType: 'string'
    },
    { label: '通道名称', value: 'name', type: 'input', filedType: 'string' },
    {
      label: '序列化数据',
      value: 'serialize_data',
      type: 'input',
      filedType: 'string'
    }
  ],
  tableName: tableName
};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options
})
@Component({
  selector: 'app-tx990405',
  templateUrl: './tx990405.component.html',
  styleUrls: ['./tx990405.component.css']
})
export class Tx990405Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @ViewChild('baseFormPeer', {static: true})
  baseFormPeer: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>;
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{
    type: string
    transCode: string
    params: any
  }> = new EventEmitter();
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }> = new EventEmitter();
  constructor(
    public settingService: SettingService,
    public notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private global: GlobalService
  ) {
    super(transCode);
  }
  appId: number;
  appName: string;
  peerModal = {
    header: [
      {
        key: 'peer_id',
        label: '节点',
        dictId: 'SYS_PEER_ID'
      },
      {
        key: 'channel_id',
        label: '通道',
        dictId: 'SYS_CHANNEL_ID'
      },
      {
        key: 'type',
        label: '节点类型',
        dictId: 'SYS_TYPE'
      }
    ],
    data: [],
    condition: {
      pagesize: 10
    },
    totalCount: 0,
    topActions: [{ key: 'addPeer', label: '新增' }],
    isLoading: false,
    rowActions: [
      // { key: ACTIONS.UPDATE, label: '修改' },
      { key: 'deletePeer', label: '删除' }
    ],
    isrowEdit: true,
    isOkLoading: false,
    isVisible: false
  };
  channelId: string;
  channelName: string;
  isVisible = false;
  appcode: string;
  onEnterAfter(): void {
    this.queryModel.rowActions[2] = { key: 'peer', label: '节点配置' };
    this.queryModel.rowActions[3] = { key: 'structure', label: '构建' };
    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb,
      submitEvent: this.submitEvent,
      baseForm: this.baseForm,
      notification: this.notification,
      modelService: this.modelService
    });
  }

  inputParams(params: any, name: string, code: string): void {
    this.appId = params;
    this.appName = name;
    this.appcode = code;
    // this.baseForm.formchangesValue['app_id'] = this.appId
    this.queryModel.staticParams = { app_id: params };
  }
  listDataCallback(data: any): void { }

  rowActionsHandler(event) {
    this.channelName = event.item.name;
    this.channelId = event.item.id;
    if (event.key === 'peer') {
      this.getPeerQuery();
    } else if (event.key === 'structure') {
      this.initFun();
    } else {
      super.rowActionsHandler(event);
    }
  }

  onCrudTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;

    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    );

    if (result.returncode === '000000') {
      switch (tcFuncCode) {
        case 'queryPeerChannel':
          this.queryModel.isLoading = false;
          this.peerModal.data = result.resultdata.bdy.data;
          this.isVisible = true;
          break;
        case 'updatePeer':
          this.getPeerQuery();
          break;
        case 'deletePeer':
          this.getPeerQuery();
          break;
        case 'addPeer':
          this.peerModal.isVisible = false;
          this.peerModal.isOkLoading = false;
          this.getPeerQuery();
          break;
      }
    } else {
      // this.notification.create('error', result.returnmessage, '')
      this.queryModel.isLoading = false;
      this.peerModal.isVisible = false;
      this.peerModal.isOkLoading = false;
    }
  }
  getPeerQuery() {
    this.queryModel.isLoading = true;
    TransCommonApiHelper.conditionQuery(this, 'queryPeerChannel', {
      tablename: 'fabric_peer_channel',
      page: '1',
      pagesize: '10',
      params: [
        {
          logic: 'AND',
          queryList: [
            {
              logic: 'AND',
              operator: 'EQ',
              params: ['channel_id', this.channelId]
            }
          ]
        }
      ]
    });
  }
  selectRowsHandler(event) { }
  pageChange(event) { }
  topActionsHandlerPeer(event) {
    if (event.key === 'addPeer') {
      this.baseFormPeer.initData();
      this.peerModal.isVisible = true;
    }
  }
  editActiveHandler(event) {
    console.log(event);

    TransCommonApiHelper.update(this, 'updatePeer', {
      tablename: 'fabric_peer_channel',
      data: event
    });
  }
  handleOkAddPeer() {
    // this.baseFormPeer
    this.peerModal.isOkLoading = true;
    this.baseFormPeer.formchangesValue['channel_id'] = this.channelId;
    TransCommonApiHelper.insert(this, 'addPeer', {
      tablename: 'fabric_peer_channel',
      data: this.baseFormPeer.formchangesValue
    });
  }
  onAddOrUpdateBefore(event) {
    event.app_id = this.appId;
  }
  peerRowActionsHandler(event) {
    if (event.key === 'deletePeer') {
      this.modelService.confirm({
        nzTitle: '是否确认删除?',
        nzOkText: '确定',
        nzOkType: 'danger',
        nzOnOk: () => {
          TransCommonApiHelper.delete(this, 'deletePeer', {
            tablename: 'fabric_peer_channel',
            id: [event.item.id]
          });
        },

        nzCancelText: '取消',
        nzOnCancel: () => console.log('Cancel')
      });
    }
  }

  initFun() {
    const url = this.global.ipserver + '/blkchain/channel';
    let options = {
      funccode: 'construct',
      requestdata: {
        bdy: {
          appcode: this.appcode,
          channelname: this.channelName
        }
      }
    };

    this.queryModel.isLoading = true;
    this.http.post(url, options).subscribe(
      res => {
        this.queryModel.isLoading = false;
      },
      errror => {
        this.queryModel.isLoading = false;
      }
    );
  }
}
