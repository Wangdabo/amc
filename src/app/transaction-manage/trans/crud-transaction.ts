import { BaseTransaction } from './base-transaction';
import { TransactionContext } from '../context/transaction.context';
import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { OutputAction } from '../interface/custom-action/output.action';
import { Observable } from 'rxjs';
import { TransactionContextHelper } from '../context/transaction.context.helper';
import { ResultData, ServiceResult } from 'tms-platform';
import { FormComponent } from "tms-platform-component";
import { TransCommonApiHelper } from './trans-common-api-helper';

enum ACTIONS {
  ADD, UPDATE, DELETE, BATCH_REMOVE
}
export abstract class CrudTransaction extends BaseTransaction {
  public static BASE_FUNC = ['conditionQuery', 'update', 'insert', 'delete'];
  private static SVC_CODE = 'TX001';
  protected ROW_ACTIONS = [{ key: ACTIONS.UPDATE, label: '修改' }, { key: ACTIONS.DELETE, label: '删除' }];
  private form: FormComponent;
  private notificationService;
  private modal;
  private selectRows: Array<any>;
  protected TOP_ACTIONS = [{ key: ACTIONS.ADD, label: '新增', icon: 'plus', isHide: false },
  { key: ACTIONS.BATCH_REMOVE, label: '批量删除', type: 'default', isHide: true }];
  queryModel: {
    header: Array<{ key: string, label: string }>,
    queryHeader: Array<{ value: string, label: string, type: string, filedType: string }>,
    data: Array<any>,
    totalCount: number,
    pageChange: Function,
    isLoading: boolean,
    topActions: Array<{ key: string | number, label: string, type?: string, icon?: string, isHide?: boolean }>,
    rowActions: Array<{ key: string | number, label: string, isShowFieldName?: string }>,
    condition: {
      page: string,
      pagesize: string,
      params?: any,
      joinOps?: any
    },
    staticParams?: any,
    staticExParams?: Array<any>,
  };
  insertOrUpdateModel: {
    isVisible: boolean,
    isUpdate: boolean,
    isOkLoading: boolean,
    isValid?: boolean,
    data: any
  };
  deleteModel: { id: Array<string> };
  constructor(transCode: string) {
    super(transCode);
    this.onBeforeInitModel();
    this.queryModel = {
      header: this.transactionDef.options.header,
      queryHeader: this.transactionDef.options.queryHeader,
      data: [],
      totalCount: 0,
      pageChange: this.pageChange,
      isLoading: false,
      topActions: this.TOP_ACTIONS,
      rowActions: this.ROW_ACTIONS,
      condition: {
        pagesize: this.transactionDef.options.pageSize ? this.transactionDef.options.pageSize : '10',
        page: '1',
        joinOps: this.transactionDef.options.joinOps
      }
    };
    this.insertOrUpdateModel = {
      isVisible: false,
      isUpdate: false,
      isOkLoading: false,
      data: {}
    };
    this.deleteModel = { id: [] };
    this.onAfterInitModel(this.queryModel, this.insertOrUpdateModel, this.deleteModel);
  }

  protected listDataCallback(data: any): void {
  }

  public initCrud(data: {
    transactionContextChangeOb: Observable<{ tcFuncCode: string, transactionContext: TransactionContext }>,
    submitEvent: EventEmitter<{ svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }>,
    baseForm: FormComponent,
    notification: NzNotificationService,
    modelService: NzModalService,
    sonRouteEvent?: EventEmitter<{ type: string, transCode: string, params: any }>
  }): void {
    super.initBase(data.transactionContextChangeOb, data.submitEvent, data.sonRouteEvent);
    this.form = data.baseForm;
    this.notificationService = data.notification;
    this.modal = data.modelService;
    setTimeout(() => {
      this.query();
    });
  }
  private refreshModel(tcFuncCode: string, transactionContext: TransactionContext, transCode?: string): void {
    switch (tcFuncCode) {
      case 'conditionQuery':
        const resultData: ResultData = TransactionContextHelper.getServiceResult(transactionContext, tcFuncCode, transCode).resultdata;
        this.listDataCallback(resultData.bdy.data);
        this.queryModel.data = resultData.bdy.data;

        this.queryModel.totalCount = resultData.bdy.count;
        this.queryModel.isLoading = false;
        break;
    }
  }

  protected query() {
    this.TOP_ACTIONS[1].isHide = true;
    this.queryModel.isLoading = true;
    // 在动态参数中加入静态参数, 默认用AND方式连接
    const condition = { ...this.queryModel.condition };
    if (this.queryModel.staticParams) {
      for (const key in this.queryModel.staticParams) {
        if (this.queryModel.staticParams.hasOwnProperty(key)) {
          if (!condition.params) { condition.params = []; }
          condition.params.push({
            'logic': 'AND',
            'queryList': [{
              'logic': 'AND',
              'operator': 'EQ',
              'params': [key, this.queryModel.staticParams[key]]
            }]
          });
        }
      }
    }
    if (this.queryModel.staticExParams && this.queryModel.staticExParams.length > 0) {
      condition.params.concat(this.queryModel.staticExParams);
    }
    this.submitCrud('conditionQuery', condition);
  }
  private update(model: any) {
    this.onUpdateActionBefore(model);
    this.insertOrUpdateModel.isUpdate = true;
    this.insertOrUpdateModel.isVisible = true;
    this.form.initData(model);
    this.insertOrUpdateModel.data = model;
  }
  private add() {
    this.onAddActionBefore();
    this.insertOrUpdateModel.isUpdate = false;
    this.insertOrUpdateModel.isVisible = true;
    this.form.initData();
    this.insertOrUpdateModel.data = {};
  }
  private remove(id: string) {
    this.modal.confirm({
      nzTitle: '请确认删除', nzOnOk: () => {
        this.deleteModel.id.length = 0.;
        this.deleteModel.id.push(id);
        this.submitCrud('delete', this.deleteModel);
      }
    });
  }
  private batchRemove() {
    this.modal.confirm({
      nzTitle: '请确认批量删除', nzOnOk: () => {
        this.deleteModel.id.length = 0.;
        this.selectRows.forEach(item => this.deleteModel.id.push(item.id));
        this.submitCrud('delete', this.deleteModel);
      }
    });
  }
  private submitCrud(funcCode: string, model: any): void {
    const tableName = this.transactionDef.options.tableName;
    const bdy = { ...model, tablename: tableName };
    super.submit(CrudTransaction.SVC_CODE, funcCode, funcCode, bdy);
  }

  pageChange($event: { pageIndex: string }): void {
    this.queryModel.condition.page = $event.pageIndex;
    this.query();
  }
  topActionsHandler($event: { key: string | number }): void {
    switch ($event.key) {
      case ACTIONS.ADD:
        this.add();
        break;
      case ACTIONS.BATCH_REMOVE:
        this.batchRemove();
        break;
    }
  }
  rowActionsHandler($event: { key: string | number, item: any }): void {
    switch ($event.key) {
      case ACTIONS.UPDATE:
        this.update($event.item);
        break;
      case ACTIONS.DELETE:
        this.remove($event.item.id);
        break;
    }
  }

  onTransactionContextChange(tcFuncCode: string, transactionContext: TransactionContext, transCode?: string) {
    this.onCrudTransactionContextChange(tcFuncCode, transactionContext, transCode);
    this.refreshModel(tcFuncCode, transactionContext, transCode);
  }
  customOutput(data: ServiceResult, funcCode: string): void {
    if (data.returncode === '000000') {
      if (funcCode === 'insert' || funcCode === 'update') {
        this.insertOrUpdateModel.isVisible = false;
        this.insertOrUpdateModel.isOkLoading = false;
        this.query();
        this.createNotification('success', '成功', data.returnmessage);
      } else if (funcCode === 'delete') {
        if (this.selectRows) {
          this.selectRows.length = 0;
        }
        this.query();
        this.createNotification('success', '成功', data.returnmessage);
      }
    } else {
      this.queryModel.isLoading = false;
      this.insertOrUpdateModel.isOkLoading = false;
      this.createNotification('error', '失败', data.returnmessage);
    }
  }
  createNotification(type: string, title: string, content: string): void {
    this.notificationService.create(type, title, content);
  }
  handleOk(): void {
    this.insertOrUpdateModel.isOkLoading = true;
    if (this.form.valid()) {
      const submitData = { ...this.insertOrUpdateModel.data, ...this.form.getData() };
      this.onAddOrUpdateBefore(submitData);
      if (this.insertOrUpdateModel.isUpdate) {
        this.submitCrud('update', { data: submitData });
      } else {
        this.submitCrud('insert', { data: submitData });
      }
    } else {
      this.insertOrUpdateModel.isOkLoading = false;
    }
  }
  handleCancel(): void {
    this.insertOrUpdateModel.isVisible = false;
  }
  selectRowsHandler($event): void {
    if ($event.selectRows.length > 0) {
      this.TOP_ACTIONS[1].isHide = false;
    } else {
      this.TOP_ACTIONS[1].isHide = true;
    }
    this.selectRows = $event.selectRows;
  }
  getQueryData($event) {
    this.queryModel.condition.params = $event;
    this.query();
  }
  reset($event) {
    this.getQueryData($event);
  }
  protected onUpdateActionBefore(model: any): void { }
  protected onAddActionBefore(): void { }
  protected onAddOrUpdateBefore(submitData: any): void { }
  protected onCrudTransactionContextChange(tcFuncCode: string, transactionContext: TransactionContext, transCode?: string): void { }
  protected onBeforeInitModel(): void { }
  protected onAfterInitModel(queryModel: any, insertOrUpdateModel: any, deleteModel: any): void { }
}
