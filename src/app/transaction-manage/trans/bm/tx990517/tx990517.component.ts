import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { IfearmService } from '../../../../service/ifearm.service';
import { BaseTransaction } from '../../base-transaction';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { TransCommonApiHelper } from '../../trans-common-api-helper';
import { BsaApi, ServiceTypeEnum, ServiceRequest } from 'tms-platform';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const transCode = 'tx990517';
const transName = '服务器配置';
const tableName = '';
const exFuncCode = ['insertList', 'queryList', 'del'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990517',
  templateUrl: './tx990517.component.html',
  styleUrls: ['./tx990517.component.css']
})
export class Tx990517Component extends BaseTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>;

  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }> = new EventEmitter();
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{
    type: string
    transCode: string
    params: any
  }> = new EventEmitter();
  orbitUrl: SafeResourceUrl;
  constructor(public ifearm: IfearmService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private message: NzMessageService,
    private bsaApi: BsaApi,

  ) {
    super(transCode);
  }
  visible = false;
  out = false;
  defaultCheckedKeys = [];
  menuList: Array<{ key: string | number, value: string }>;
  treeData = [];
  isShow = true;
  parent_id: any;
  isAdd = false;
  isZu = '1';

  treeEvent(event): void {

  }

  close(): void {
    this.visible = false;
  }
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);
    this.queryList();
    this.menuList = [];
  }
  listDataCallback(data: any): void {
  }

  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
  }
  checkedEventHandler(item) {
    let ids;
    ids = [];
    item.event.forEach(i => {
      ids.push(i.origin.id);
      if (i.children.length > 0) {
        i.children.forEach(j => {
          ids.push(j.origin.id);
        });
      }
    });


  }
  clickEventHandler(event) {
    this.isShow = false;
    this.isAdd = false;
    setTimeout(() => {
      // this.baseForm.setValue('')
      this.baseForm.setValue('group_name', event.event.origin.group_name);
      this.baseForm.setValue('server_name', event.event.origin.server_name);
      this.baseForm.setValue('type', event.event.origin.type);
      this.baseForm.disabled('type', true);
      this.baseForm.setValue('ip', event.event.origin.ip);
      this.baseForm.setValue('user', event.event.origin.user);
      this.baseForm.setValue('passwd', event.event.origin.passwd);
    });
    this.parent_id = event.event.origin;
  }

  queryList() {
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.VERSION,
      funccode: 'server_query',
      svccode: '',
      requestdata: {
        coh: {}, bdy: {}
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        if (data.resultdata.bdy.length === 0) {
          this.isShow = true;
        } else {
          this.treeData = [];
          this.treeData = data.resultdata.bdy.map(item => {
            let name = item.server_name;
            if (item.type === '1') {
              name = item.group_name;
            }
            return { title: name, treenodeid: item.id, pid: item.parent_id, icon: 'menu-unfold', ...item };
          });

        }

      } else {
        this.message.create('error', data.returnmessage);

      }
    });
  }
  submitForm() {
    const obj = this.baseForm.getData();
    let server;
    console.log(obj);

    if (!this.isAdd) {
      obj.id = this.parent_id.id;
      server = 'server_update';
    } else {
      server = 'server_save';

    }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // tslint:disable-next-line: no-shadowed-variable
        const element = obj[key];
        if (element === null || element === '' || element === undefined) {
          delete obj[key];
        }
      }
    }
    console.log(obj);


    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.VERSION,
      funccode: server,
      svccode: '',
      requestdata: {
        coh: {}, bdy: obj
      }
    };
    console.log(obj);

    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        console.log(data);
        this.message.create('success', data.returnmessage);
        this.queryList();
      } else {
        this.message.create('error', data.returnmessage);

      }
    });
  }
  del(id) {
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.VERSION,
      funccode: 'server_delete',
      svccode: '',
      requestdata: {
        coh: {}, bdy: { ids: [id] }
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        console.log(data);
        this.message.create('success', data.returnmessage);

        this.queryList();
      } else {
        this.message.create('error', data.returnmessage);

      }
    });
  }
  changesValue(event) {

    this.isZu = event.type;

  }
  rightClickEventHandler(event) {

    this.parent_id = event.event.node;
    switch (event.event.name) {
      case 'addP':

        this.add(event.event.node, 'P');

        break;
      case 'addS':

        this.add(event.event.node, 'S');

        break;
      case 'del':
        this.del(event.event.node.id);
        break;

    }
  }
  rightEventHandler(event) {
    if (this.menuList.length > 0) {
      this.menuList.splice(0);
    }
    if (event.event.node.origin.type === '1') {
      this.menuList.push({ key: 'addP', value: '新增同级' },
        { key: 'addS', value: '新增子级' },
        { key: 'del', value: '删除' })

    } else {
      this.menuList.push({ key: 'addP', value: '新增同级' }, { key: 'del', value: '删除' })
    }
  }
  add(event, type) {
    this.isShow = false;
    this.isAdd = true;
    this.isZu = '1';
    console.log(event);

    setTimeout(() => {
      this.baseForm.initData();
      this.baseForm.setValue('type', '1');
      if (type === 'P') {
        this.baseForm.setValue('parent_id', event.pid);
      } else {
        this.baseForm.setValue('parent_id', event.id);
      }
      this.baseForm.disabled('type', false);
      console.log(this.baseForm.getData());

    });

  }
  testClick() {
    const obj = this.baseForm.getData();
    if (!this.returnValue(obj.ip) || !this.returnValue(obj.user) || !this.returnValue(obj.passwd)) {
      return this.message.create('error', '信息输入完整才可测试！');
    }
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.VERSION,
      funccode: 'amc_server',
      svccode: '',
      requestdata: {
        coh: {}, bdy: {
          data: {
            module: 'amc',
            operation: 'ServerConnectTest',
            server_list: [
              { user: obj.user, pwd: obj.passwd, ip: obj.ip }
            ]
          }
        }
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        console.log(data);
        this.message.create('success', data.returnmessage);
      } else {
        this.message.create('error', data.returnmessage);

      }
    });
  }
  returnValue(data) {
    if (data === undefined || data === '' || data === null) {
      return false;
    } else {
      return true;
    }
  }
}
