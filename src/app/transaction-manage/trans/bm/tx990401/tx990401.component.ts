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
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from 'src/app/service/global.service';

const transCode = 'tx990401';
const transName = '区块链应用';
const tableName = 'blkchain_app';
const exFuncCode = ['channel'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [
    {
      key: 'code',
      label: '应用代码'
    },
    {
      key: 'name',
      label: '应用名称',
      isclick: true
    },
    {
      key: 'version',
      label: '版本'
    },
    {
      key: 'tls',
      label: '启用tls',
      dictId: 'SYS_TLS'
    }
  ],
  queryHeader: [
    { label: '应用代码', value: 'code', type: 'input', filedType: 'string' },
    { label: '应用名称', value: 'name', type: 'input', filedType: 'string' },
    { label: '版本', value: 'version', type: 'input', filedType: 'string' },
    {
      label: '启用tls',
      value: 'trans_flag',
      type: 'select',
      filedType: 'string',
      dictId: 'SYS_TLS'
    }
  ],
  tableName: tableName
};
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
  options: options
})
@Component({
  selector: 'app-tx990401',
  templateUrl: './tx990401.component.html',
  styleUrls: ['./tx990401.component.css']
})
export class Tx990401Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
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
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private global: GlobalService
  ) {
    super(transCode);
  }
  // ACTIONS {
  //   ADD, UPDATE, DELETE, BATCH_REMOVE
  // }
  data = [];
  isVisible = false;
  gridStyle = {
    width: '25%',
    textAlign: 'center',
    cursor: 'pointer',
    'margin-right': '10px'
  };
  appId: number;
  appName: string;
  channelName: string;
  appcode: string;
  onEnterAfter(): void {
    // this.queryModel.rowActions = [
    //   { key: ACTIONS.UPDATE, label: '修改' },
    //   { key: ACTIONS.DELETE, label: '删除' },
    //   { key: 'view', label: '视图概览' }
    // ]
    this.queryModel.rowActions[2] = { key: 'view', label: '视图概览' };
    this.queryModel.rowActions[3] = { key: 'init', label: '初始化' };
    this.queryModel.rowActions[4] = { key: 'synchro', label: '区块同步' };

    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb,
      submitEvent: this.submitEvent,
      baseForm: this.baseForm,
      notification: this.notification,
      modelService: this.modelService,
      sonRouteEvent: this.sonRouteEvent
    });
  }


  onCrudTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;

    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    ).resultdata;
    switch (tcFuncCode) {
      case 'channel':
        this.data = result.bdy;
        this.queryModel.isLoading = false;
        this.isVisible = true;
        console.log(result);

        break;
    }
  }

  listDataCallback(data: any): void { }

  rowActiveHandler(event) {
    this.appId = event.id;
    this.appName = event.name;
    console.log(event);

    super.skipSonRoute('tx990442', {
      appId: this.appId,
      appName: this.appName,
      appcode: event.code
    });
    // this.submit('TX002', 'channel', 'block_chain.fabricChannelByAppId', obj)
  }

  goApp(it) {
    this.channelName = it.name;
    super.skipSonRoute('tx990441', {
      appId: this.appId,
      appName: this.appName,
      channelId: it.id,
      channelName: this.channelName
    });
  }

  rowActionsHandler(event) {
    this.appcode = event.item.code;
    this.appId = event.item.id;
    this.appName = event.item.name;
    if (event.key === 'view') {
      const obj = {
        app_id: event.item.id
      };
      this.queryModel.isLoading = true;
      this.submit('TX002', 'channel', 'block_chain.fabricChannelByAppId', obj);
    } else if (event.key === 'init') {
      this.modelService.confirm({
        nzTitle: '是否强制初始化?',
        nzMaskClosable: true,
        nzOkText: '确定',
        nzOkType: 'danger',
        nzOnOk: () => {
          this.initFun('1');
        },
        nzCancelText: '不需要',
        nzOnCancel: () => {
          this.initFun('0');
        }
      });
    } else if (event.key === 'synchro') {
      this.modelService.confirm({
        nzTitle: '是否确认同步?',
        nzOkText: '确定',
        nzOkType: 'danger',
        nzOnOk: () => {
          this.synchro();
        },
        nzCancelText: '取消'
      });
    } else {
      super.rowActionsHandler(event);
    }
  }
  initFun(obj) {
    const url = this.global.ipserver + '/blkchain/app';
    let options = {
      funccode: 'init',
      requestdata: {
        bdy: {
          appcode: this.appcode,
          force: obj
        }
      }
    };

    this.queryModel.isLoading = true;
    this.http.post(url, options).subscribe(
      res => {
        this.queryModel.isLoading = false;
        console.log(res);
      },
      errror => {
        this.queryModel.isLoading = false;
        console.log(errror);
      }
    );
  }
  synchro() {
    const url = this.global.ipserver + '/blkchain/app';
    // tslint:disable-next-line: no-shadowed-variable
    const options = {
      funccode: 'sync',
      requestdata: {
        bdy: {
          appcode: this.appcode,
        }
      }
    };

    this.queryModel.isLoading = true;
    this.http.post(url, options).subscribe(
      res => {
        this.queryModel.isLoading = false;
        console.log(res);
      },
      errror => {
        this.queryModel.isLoading = false;
        console.log(errror);
      }
    );
  }
}
