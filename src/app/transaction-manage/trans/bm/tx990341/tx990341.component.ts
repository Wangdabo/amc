import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from "tms-platform-component";
import { SettingService } from '../../../../service/setting.service';
import { BaseTransaction } from '../../base-transaction';
import { Tx990341_3Component } from '../tx990341/tx990341_3.component';
import { OutputAction } from '../../../interface/custom-action/output.action';
import { ResultData, ServiceResult } from 'tms-platform';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { Tx990341_2Component } from '../tx990341/tx990341_2.component';


import { TransCommonApiHelper } from '../../trans-common-api-helper';

const transCode = 'tx990341';
const transName = '交易菜单维护';
const exFuncCode = ['treeDataQuery', 'treeDataU', 'treeDataA', 'treeDataD', 'appQuery'];

@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: exFuncCode,
  subTransCodes: ['tx990341_2', 'tx990341_3']
})
@Component({
  selector: 'app-tx990341',
  templateUrl: './tx990341.component.html',
  styleUrls: ['./tx990341.component.css'],
})
export class Tx990341Component extends BaseTransaction implements OutputAction {
  @ViewChild('baseForm', {static: false})
  baseForm: FormComponent;
  @ViewChild('baseForm2', {static: false})
  baseForm2: FormComponent;
  @ViewChild('tx990341_3', {static: false})
  tx990341_3: Tx990341_3Component;
  @ViewChild('tx990341_2', {static: false})
  tx990341_2: Tx990341_2Component;

  @Input('transactionContextChangeOb') transactionContextChangeOb: Observable<{ tcFuncCode: string, transactionContext: TransactionContext }>;
  @Output('submitEvent') submitEvent: EventEmitter<{ svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }> = new EventEmitter();
  treeData: Array<any>;
  menuList: Array<{ key: string | number, value: string }>;
  tabs;
  menuId: any;
  clicknodeinfo: any;
  nodeinfo: any;
  isshowTab = false;
  modaltt: any;
  sindex: any;
  modalopen = false;
  uorgdata: any;
  actionisupdate: any;
  notificationService: any;
  modalService: any;
  treeshow = true; //　树结构是否显示
  appList: any; // 所有应用数组
  appId: string;
  rootMune = false;
  constructor(public settingService: SettingService, private notification: NzNotificationService, private modelService: NzModalService) {
    super(transCode);
    this.notificationService = notification;
    this.modalService = modelService;
  }
  onEnterAfter(): void {

    super.initBase(this.transactionContextChangeOb, this.submitEvent);
    // this.initTree();
    this.appQuery();
    this.initTab();
    //this.initTab();
  }

  // 查询所有在应用
  appQuery() {
    TransCommonApiHelper.conditionQuery(this, 'appQuery', {
      tablename: 'btf_app',
      page: '1',
      pagesize: '999'
    });
  }

  // 选择应用在时候方法
  selectChange(): void {
    this.treeData = [];
    this.treeshow = false;
    this.isshowTab = false; // 关闭
    this.initTree(this.appId); // 查询数节点
  }

  // 新增跟菜单
  addrootMenu() {
    this.modaltt = '新增跟菜单';
    this.modalopen = true;
    this.baseForm2.initData();
  }

  tabSelect(tabId: string) {
    if (tabId === 'main') {
      this.sindex = 0
      //this.getSelDetail();
      setTimeout(_ => {
        this.showDetail();
      });
    }
    if (tabId === 'nexme') {
      this.sindex = 1
      this.tx990341_2.inputParams(this.menuId, this.appId);
      this.tx990341_2.onEnterAfter();
    }
    if (tabId === 'translist') {
      this.sindex = 2;
      this.tx990341_3.inputParams(this.menuId);
      this.tx990341_3.onEnterAfter();
    }
  }

  initQuery() {
    TransCommonApiHelper.conditionQuery(this, 'treeDataQuery', { tablename: 'btf_menu', page: '1', pagesize: '999',
        params: [
          {
            logic: "AND",
            queryList: [
              {
                logic: "AND",
                operator: "EQ",
                params: ["app_id", this.appId]
              }
            ]
          }]});
  }

  customOutput(data: ServiceResult, tcFuncCode: string): void {
    const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);
    if (parse.name === Tx990341_3Component.name) {
      this.tx990341_3.customOutput(data, parse.funcCode);
    }
    if (parse.name === Tx990341_2Component.name) {
      this.tx990341_2.customOutput(data, parse.funcCode);
    }

  }
  onTransactionContextChange(tcFuncCode: string, transactionContext: TransactionContext) {
    if (tcFuncCode === 'treeDataQuery') {
      const resultData: ResultData = TransactionContextHelper.getServiceResult(transactionContext, tcFuncCode).resultdata;
      if(resultData.bdy.data.length === 0) { // 代表没有跟菜单，那就新建一个跟菜单
          this.rootMune = true;
      } else {
        this.rootMune = false;
      }
      this.treeData = resultData.bdy.data.map(item => {
        return { title: item.menu_name, treenodeid: item.menu_code, pid: item.parent_id, icon: 'menu-unfold', ...item };
      });
      return;
    }
    if (tcFuncCode === 'treeDataU') {
      const sresultData = TransactionContextHelper.getServiceResult(transactionContext, tcFuncCode);
      console.log(sresultData);
      this.actionafter(sresultData)
      return;
    }
    if (tcFuncCode === 'treeDataA') {
      const sresultData = TransactionContextHelper.getServiceResult(transactionContext, tcFuncCode);
      this.actionafter(sresultData)
      return;
    }
    if (tcFuncCode === 'treeDataD') {
      const sresultData = TransactionContextHelper.getServiceResult(transactionContext, tcFuncCode);
      console.log(sresultData);
      this.actionafter(sresultData)
      return;
    }

    if (tcFuncCode === 'appQuery') { // 查询所有应用
      const resultData: ResultData = TransactionContextHelper.getServiceResult(transactionContext, tcFuncCode).resultdata;
      this.appList = resultData.bdy.data;
      return;
    }


    const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);
    if (parse.name === Tx990341_3Component.name) {
      this.tx990341_3.onTransactionContextChange(parse.funcCode, transactionContext, 'tx990341_3');
      return;
    }
    if (parse.name === Tx990341_2Component.name) {
      this.tx990341_2.onTransactionContextChange(parse.funcCode, transactionContext, 'tx990341_2');
      // this.initQuery(); // 重新查询数
      return;
    }

  }

  //  重新查询数据
  actionafter(data) {
    if (data.returncode === '000000') {
      TransCommonApiHelper.conditionQuery(this, 'treeDataQuery', { tablename: 'btf_menu', page: '1', pagesize: '999',
        params: [
          {
            logic: "AND",
            queryList: [
              {
                logic: "AND",
                operator: "EQ",
                params: ["app_id", this.appId]
              }
            ]
          }]});
      this.notificationService.create('success', '成功', data.returnmessage);
    } else {
      this.notificationService.create('error', '失败', data.returnmessage);
    }
  }

  initTree(id) {
    TransCommonApiHelper.conditionQuery(this, 'treeDataQuery',
      { tablename: 'btf_menu', page: '1', pagesize: '999',
        params: [
          {
            logic: "AND",
            queryList: [
              {
                logic: "AND",
                operator: "EQ",
                params: ["app_id", id]
              }
            ]
          }]}
      );
    this.menuList = [
      { key: 'add', value: '新增' },
      { key: 'edit', value: '修改' },
      { key: 'del', value: '删除' }
    ];
  }


  treeEvent(event) {

  }

  clickEventHandler(event) {
    console.log(event)

    this.sindex = 0;
    if (!this.isshowTab) {
      this.isshowTab = true;
    }
    this.menuId = event.event.key;
    this.clicknodeinfo = event.event;

    setTimeout(_ => {
      this.showDetail();
    });

  }
  getSelDetail() {
    this.nodeinfo = this.clicknodeinfo.origin;
  }
  showDetail() {
    this.getSelDetail();
    this.baseForm.disabledAll();
    this.baseForm.initData(this.nodeinfo);
  }
  rightClick(event) {
    if (event.event.name === 'add') {
      this.actionisupdate = false;
      this.modaltt = '新增菜单';
      this.modalopen = true;
      let data = { parent_id: event.event.node.menu_code }
      this.baseForm2.initData(data);
      this.baseForm2.disabled('menu_code', false);
    }
    if (event.event.name === 'edit') {
      this.actionisupdate = true;
      this.modaltt = '修改菜单';
      this.modalopen = true;
      let nodeinfo = event.event.node;
      delete nodeinfo.children;
      delete nodeinfo.parentNode;
      this.baseForm2.initData(nodeinfo);
      this.uorgdata = nodeinfo;
      this.baseForm2.disabled('menu_code', true);
    }
    if (event.event.name === 'del') {
      if ('children' in event.event.node) {
        this.notificationService.create('error', '失败', '存在子菜单,无法删除');
        return;
      }
      this.removeorg(event.event.node.id, event.event.node.menu_name);
    }
  }



  rightEventHandler(event) {
    if (this.menuList.length > 0) {
      this.menuList.splice(0);
    }
    // 如果是跟目录,不能删除
    if(event.event.node.origin.menu_code === 'MENU_MENU_APP') {
      this.menuList.push({ key: 'add', value: '新增子应用' },
        { key: 'edit', value: '修改' })
    } else {
      this.menuList.push({ key: 'add', value: '新增菜单' },
        { key: 'edit', value: '修改' },
        { key: 'del', value: '删除' })
    }

  }
  handleCancel() {
    this.modalopen = false;
  }

  handleOk() {
    if (this.actionisupdate) {
      this.updateMneu(); // 更新数节点
    } else {
      this.addMneu(); // 新增菜单数节点
    }

    this.modalopen = false;
  }

  // 更新菜单
  updateMneu() {
    const submitData = { ...this.uorgdata, ...this.baseForm2.getData() };
    submitData['app_id'] = this.appId;
    TransCommonApiHelper.update(this, 'treeDataU', { tablename: 'btf_menu', data: submitData });
  }

  // 新增菜单
  addMneu() {
    const submitData = { ...this.baseForm2.getData() };
    submitData['app_id'] = this.appId;
    TransCommonApiHelper.insert(this, 'treeDataA', { tablename: 'btf_menu', data: submitData });
  }

  removeorg(id, orgstr) {
    this.modalService.confirm({
      nzTitle: '请确认删除菜单', nzContent: orgstr, nzOnOk: () => {
        let submitData = new Array();
        submitData.push(id);
        TransCommonApiHelper.delete(this, 'treeDataD', { tablename: 'btf_menu', id: submitData });
      }
    });
  }

  initTab() {
    this.tabs = [
      { id: 'main', text: '菜单信息' },
      { id: 'nexme', text: '下级菜单' },
      { id: 'translist', text: '所含交易' },
    ];
  }


  submitTx990341_2EventHandler(event: { svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }) {
    super.submit(event.svcCode, TransactionContextHelper.formatFuncCode('tx990341_2', event.tcFuncCode), event.funcCode, event.bdy);
  }
  submitTx990341_3EventHandler(event: { svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }) {
    super.submit(event.svcCode, TransactionContextHelper.formatFuncCode('tx990341_3', event.tcFuncCode), event.funcCode, event.bdy);
  }


}
