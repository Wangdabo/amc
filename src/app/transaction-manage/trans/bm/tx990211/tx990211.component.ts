import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewChild
} from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';
import { BaseTransaction } from '../../base-transaction';
import { Tx990211_3Component } from '../tx990211/tx990211_3.component';
import { OutputAction } from '../../../interface/custom-action/output.action';
import { ResultData, ServiceResult, ServiceRequest } from 'tms-platform';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { Tx990211_2Component } from '../tx990211/tx990211_2.component';
import { Tx990211_4Component } from '../tx990211/tx990211_4.component';

import { TransCommonApiHelper } from '../../trans-common-api-helper';
import { GlobalService } from 'src/app/service/global.service';
import { HttpClient } from '@angular/common/http';

const transCode = 'tx990211';
const transName = '机构信息维护';
const exFuncCode = ['treeDataQuery', 'treeDataU', 'treeDataA', 'treeDataD'];

@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: exFuncCode,
  subTransCodes: ['tx990211_2', 'tx990211_3', 'tx990211_4']
})
@Component({
  selector: 'app-tx990211',
  templateUrl: './tx990211.component.html',
  styleUrls: ['./tx990211.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tx990211Component extends BaseTransaction implements OnInit, OutputAction {
  @ViewChild('baseForm', {static: false})
  baseForm: FormComponent;
  @ViewChild('baseForm2', {static: false})
  baseForm2: FormComponent;
  @ViewChild('tx990211_3', {static: false})
  tx990211_3: Tx990211_3Component;
  @ViewChild('tx990211_2', {static: false})
  tx990211_2: Tx990211_2Component;
  @ViewChild('tx990211_4', {static: false})
  tx990211_4: Tx990211_4Component;
  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{
    tcFuncCode: string
    transactionContext: TransactionContext
  }>
  @Output('submitEvent') submitEvent: EventEmitter<{
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }> = new EventEmitter();
  treeData: Array<any>;
  menuList: Array<{ key: string | number; value: string }>;
  tabs;
  orgId: any;
  clicknodeinfo: any;
  nodeinfo: any;
  isshowTab = false;
  modaltt: any;
  sindex: number;
  modalopen = false;
  uorgdata: any;
  actionisupdate: any;
  notificationService: any;
  modalService: any;

   // 按需加载所需传递数据
   AsyncOption = {
    option: {
      "svccode": "TX003",
      "svctype": "0",
      "requestdata": {
        "bdy": {
          // 表名
          "table_name": "btf_org_info",
          // 字段名
          "filed_name": 'par_org_code',
          // 字段值
          "filed_value": ''
        },
        "coh": {},
        "ctl": {}
      }
    },
    url: this.global.ipserver + '/brons/transservice',
    Object: {
      title: 'org_name',
      treenodeid: 'org_code',
      icon: 'menu-unfold'
    }
  };


  constructor(
    public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private cd: ChangeDetectorRef,
    private global: GlobalService,
    private http: HttpClient
  ) {
    super(transCode);
    this.notificationService = notification;
    this.modalService = modelService;
  }
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    this.initTree();
    this.initTab();
  }

  ngOnInit(): void {
      // this.AsyncinitTree();
  }

  tabSelect(tabId: string) {
    if (tabId === 'main') {
      this.sindex = 0;
      setTimeout(_ => {
        this.showDetail();
      });
    }
    if (tabId === 'nexorg') {
      this.sindex = 1;
      this.tx990211_2.inputParams(this.orgId);
      this.tx990211_2.onEnterAfter();
    }
    if (tabId === 'emp') {
      this.sindex = 2;
      this.tx990211_3.inputParams(this.orgId);
      this.tx990211_3.onEnterAfter();
    }
    if (tabId === 'userinfo') {
      this.sindex = 3;
      this.tx990211_4.inputParams(this.orgId);
      this.tx990211_4.onEnterAfter();
    }
  }
  customOutput(data: ServiceResult, tcFuncCode: string): void {
    const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);
    if (parse.name === Tx990211_3Component.name) {
      this.tx990211_3.customOutput(data, parse.funcCode);
    }
    if (parse.name === Tx990211_2Component.name) {
      this.tx990211_2.customOutput(data, parse.funcCode);
    }
    if (parse.name === Tx990211_4Component.name) {
      this.tx990211_4.customOutput(data, parse.funcCode);
    }
  }
  onTransactionContextChange(
    tcFuncCode: string,
    transactionContext: TransactionContext
  ) {
    try {
      if (tcFuncCode === 'treeDataQuery') {
        const resultData: ResultData = TransactionContextHelper.getServiceResult(
          transactionContext,
          tcFuncCode
        ).resultdata;
        this.treeData = resultData.bdy.data.map(item => {
          if (item.par_org_code === item.org_code) {
            return {
              title: item.org_name,
              treenodeid: item.org_code,
              icon: 'bank',
              ...item
            };
          } else {
            return {
              title: item.org_name,
              treenodeid: item.org_code,
              pid: item.par_org_code,
              icon: 'bank',
              ...item
            };
          }
        });
        return;
      }
      if (tcFuncCode === 'treeDataU') {
        const sresultData = TransactionContextHelper.getServiceResult(
          transactionContext,
          tcFuncCode
        );
        console.log(sresultData);
        this.actionafter(sresultData);
        return;
      }
      if (tcFuncCode === 'treeDataA') {
        const sresultData = TransactionContextHelper.getServiceResult(
          transactionContext,
          tcFuncCode
        );
        console.log(sresultData);
        this.actionafter(sresultData);
        return;
      }
      if (tcFuncCode === 'treeDataD') {
        const sresultData = TransactionContextHelper.getServiceResult(
          transactionContext,
          tcFuncCode
        );
        console.log(sresultData);
        this.actionafter(sresultData);
        return;
      }
      const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);
      if (parse.name === Tx990211_3Component.name) {
        this.tx990211_3.onTransactionContextChange(
          parse.funcCode,
          transactionContext,
          'tx990211_3'
        );
        return;
      }
      if (parse.name === Tx990211_2Component.name) {
        this.tx990211_2.onTransactionContextChange(
          parse.funcCode,
          transactionContext,
          'tx990211_2'
        );
        return;
      }
      if (parse.name === Tx990211_4Component.name) {
        this.tx990211_4.onTransactionContextChange(
          parse.funcCode,
          transactionContext,
          'tx990211_4'
        );
        return;
      }
    } finally {
      this.cd.markForCheck();
    }
  }

  actionafter(data) {
    if (data.returncode === '000000') {
      TransCommonApiHelper.conditionQuery(this, 'treeDataQuery', {
        tablename: 'btf_org_info',
        page: '1',
        pagesize: '999'
      });
      this.notificationService.create('success', '成功', data.returnmessage);
    } else {
      this.notificationService.create('error', '失败', data.returnmessage);
    }
  }

  // 按需加载树节点
  AsyncinitTree() {
    this.menuList = [
      { key: 'add', value: '新增' },
      { key: 'edit', value: '修改' },
      { key: 'del', value: '删除' }
    ];
    let serviceRequest: ServiceRequest = {
      svccode: "TX003",
      svctype: "0",
      requestdata: {
        bdy: {
          // 表名
          table_name: "btf_org_info",
          // 字段名
          filed_name: 'PAR_ORG_CODE',
          // 字段值
          filed_value: ''
        },
        "coh": {},
        "ctl": {}
      }
    };
    this.http.post(this.AsyncOption.url, serviceRequest, {
    headers: {
      'Authorization':  JSON.parse(sessionStorage.getItem('header'))['Authorization']
    }
  }).subscribe(items => {
    if(items['returncode'] === '000000') {
      console.log(items['resultdata'].bdy)
       this.treeData = items['resultdata'].bdy.data.map(item => {
        return { title: item.org_name,
                 treenodeid: item.org_code, 
                 pid: item.par_org_code,
                 icon: 'menu-unfold',
                 ...item 
                };
          });
    }
  })
  }

  initTree() {
    TransCommonApiHelper.conditionQuery(this, 'treeDataQuery', {
      tablename: 'btf_org_info',
      page: '1',
      pagesize: '999'
    });
    this.menuList = [
      { key: 'add', value: '新增' },
      { key: 'edit', value: '修改' },
      { key: 'del', value: '删除' }
    ];
  }
  treeEvent(event) {
 /*   if (event.event.eventName === 'expand') {
    }
    if (event.event.eventName === 'click') {

    }*/
  }

  clickEventHandler(event) {
    console.log('click--->');
    console.log(event);

    this.sindex = 0;

    if (!this.isshowTab) {
      this.isshowTab = true;
    }
    this.orgId = event.event.key;
    this.clicknodeinfo = event.event;

    setTimeout(_ => {
      this.showDetail();
    });
  }
  getSelDetail() {
    this.nodeinfo = this.clicknodeinfo.origin;
  }
  showDetail() {
    this.baseForm.disabledAll();
    setTimeout(() => {
      this.getSelDetail();
      this.baseForm.initData(this.nodeinfo);
      this.cd.markForCheck();
    });
  }
  rightClick(event) {
    if (event.event.name === 'add') {
      this.actionisupdate = false;
      this.modaltt = '新增机构';
      this.modalopen = true;
      let data = { par_org_code: event.event.node.org_code };
      this.baseForm2.initData(data);
      this.baseForm2.disabled('org_code', false);
    }
    if (event.event.name === 'edit') {
      this.actionisupdate = true;
      this.modaltt = '修改机构';
      this.modalopen = true;
      let nodeinfo = event.event.node;
      delete nodeinfo.children;
      delete nodeinfo.parentNode;
      this.baseForm2.initData(nodeinfo);
      this.uorgdata = nodeinfo;
      this.baseForm2.disabled('org_code', true);
    }
    if (event.event.name === 'del') {
      console.log('children' in event.event.node);
      console.log(event.event.node);
      if ('children' in event.event.node) {
        this.notificationService.create('error', '失败', '存在子机构,无法删除');
        return;
      }
      this.removeorg(event.event.node.id, event.event.node.org_name);
    }
  }

  handleCancel() {
    this.modalopen = false;
  }

  handleOk() {
    if (this.actionisupdate) {
      this.updateorg();
    } else {
      this.addorg();
    }

    this.modalopen = false;
  }

  updateorg() {
    const submitData = { ...this.uorgdata, ...this.baseForm2.getData() };
    TransCommonApiHelper.update(this, 'treeDataU', {
      tablename: 'btf_org_info',
      data: submitData
    });
  }

  addorg() {
    const submitData = { ...this.baseForm2.getData() };
    TransCommonApiHelper.insert(this, 'treeDataA', {
      tablename: 'btf_org_info',
      data: submitData
    });
  }

  removeorg(id, orgstr) {
    this.modalService.confirm({
      nzTitle: '请确认删除机构',
      nzContent: orgstr,
      nzOnOk: () => {
        let submitData = new Array();
        submitData.push(id);
        TransCommonApiHelper.delete(this, 'treeDataD', {
          tablename: 'btf_org_info',
          id: submitData
        });
      }
    });
  }

  initTab() {
    this.tabs = [
      { id: 'main', text: '机构信息' },
      { id: 'nexorg', text: '下级机构' },
      { id: 'emp', text: '员工信息' },
      { id: 'userinfo', text: '用户信息' }
    ]
  }

  submitTx990211_2EventHandler(event: {
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }) {
    super.submit(
      event.svcCode,
      TransactionContextHelper.formatFuncCode('tx990211_2', event.tcFuncCode),
      event.funcCode,
      event.bdy
    );
  }
  submitTx990211_3EventHandler(event: {
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }) {
    super.submit(
      event.svcCode,
      TransactionContextHelper.formatFuncCode('tx990211_3', event.tcFuncCode),
      event.funcCode,
      event.bdy
    );
  }
  submitTx990211_4EventHandler(event: {
    svcCode: string
    tcFuncCode: string
    funcCode: string
    bdy: any
  }) {
    super.submit(
      event.svcCode,
      TransactionContextHelper.formatFuncCode('tx990211_4', event.tcFuncCode),
      event.funcCode,
      event.bdy
    );
  }
}
