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
import { FormComponent, TreeComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';
import { TransCommonApiHelper } from '../../trans-common-api-helper';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';

import * as echarts from 'echarts';
const transCode = 'tx990501';
const transName = '标签库';
const tableName = 'btf_tag_info';
const exFuncCode = ['queryTreeNode', 'updateTree', 'deleteTree', 'addTree'];

const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [
    {
      key: 'tag_code',
      label: '标签代码'
    },
    {
      key: 'tag_value',
      label: '标签值'
    },
    {
      key: 'tag_name',
      label: '标签名称',
      // isclick: true
    },
    // {
    //   key: 'STATUST',
    //   label: '智能合约版本'
    // },
    // {
    //   key: 'ORDER',
    //   label: '排序'
    // }
    // },
    {
      key: 'is_multiple',
      label: '标签标识'
    }
  ],
  queryHeader: [
    {
      label: '标签代码',
      value: 'tag_code',
      type: 'input',
      filedType: 'string'
    },
    {
      label: '标签值',
      value: 'tag_value',
      type: 'input',
      filedType: 'string'
    },
    {
      label: '标签名称',
      value: 'tag_name',
      type: 'input',
      filedType: 'string'
    },
    // {
    //   label: '智能合约',
    //   value: 'STATUST',
    //   type: 'select',
    //   filedType: 'string',
    //   dictId: 'SYS_CHAINCODE_ID'
    // },
    // {
    //   label: '排序',
    //   value: 'ORDER',
    //   type: 'input',
    //   filedType: 'string'
    // }
    {
      key: 'is_multiple',
      label: '标签标识',
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
  selector: 'app-tx990501',
  templateUrl: './tx990501.component.html',
  styleUrls: ['./tx990501.component.css']
})
export class Tx990501Component extends CrudTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @ViewChild('baseFormAdd', {static: true})
  baseFormAdd: FormComponent;
  @ViewChild('tree', {static: true})
  baseTree: TreeComponent;
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
  constructor(
    public settingService: SettingService,
    private notification: NzNotificationService,
    // private datePipe: DatePipe,
    private modelService: NzModalService
  ) {
    super(transCode);
  }
  upd = {
    isVisible: false,
    isOkLoading: false
  };
  istreeCard = false;
  treeData = [];
  tagId: string;
  isShow = false;
  isAdd = false;
  treeNodeId: string;
  isSpinning = true;
  treeForm: any[] = [];
  isexpandId: string;
  onEnterAfter(): void {
    this.queryModel.rowActions[0] = { key: 'upd', label: '编辑' };
    this.queryModel.rowActions[2] = { key: 'tree', label: '树状图' };

    this.queryModel.staticParams = { par_tag_id: '0' };
    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb,
      submitEvent: this.submitEvent,
      baseForm: this.baseForm,
      notification: this.notification,
      modelService: this.modelService,
      sonRouteEvent: this.sonRouteEvent
    });
  }
  listDataCallback(data: any): void { }

  onAddOrUpdateBefore(submitData: any): any { }
  onCrudTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    );
    if (result.returncode === '000000') {
      switch (tcFuncCode) {
        case 'queryTreeNode':

          this.treeData = result.resultdata.bdy.map((item, index) => {

            if (item.par_id === item.id) {
              return {
                title: item.tag_name,
                treenodeid: item.id,
                icon: 'folder',
                ...item
              };
            } else {
              return {
                title: item.tag_name,
                treenodeid: item.id,
                pid: item.par_tag_id,
                icon: 'folder',
                ...item
              };
            }


          });
          console.log(this.isexpandId);

          if (this.isexpandId !== undefined) {

            this.baseTree.expand(this.isexpandId);
          }
          this.isSpinning = false;
          break;
        case 'updateTree':
          this.notification.create('success', '修改成功', '');
          this.getTree();
          break;
        case 'addTree':
          this.notification.create('success', '新增成功', '');
          this.isAdd = false;
          this.isShow = false;
          this.getTree();
          break;
        case 'deleteTree':
          this.isShow = false;
          this.notification.create('success', '删除成功', '');
          this.getTree();
          break;
      }
    }
  }


  rowActionsHandler(event) {
    console.log(event);
    this.tagId = event.item.id;
    if (event.key === 'upd') {
      this.treeData = [];
      this.isAdd = false;
      this.isShow = false;
      this.getTree();
      this.upd.isVisible = true;
    } else if (event.key === 'tree') {
      super.skipSonRoute('tx990500', {
        it: event.item,
      });
    } else {
      super.rowActionsHandler(event);
    }
  }

  treeClick(event) { }
  getTree() {
    this.isSpinning = true;
    super.submit('TX500004', 'queryTreeNode', '', {
      id: this.tagId
    });
    // TransCommonApiHelper.conditionQuery(this, 'queryTreeNode', {
    //   tablename: 'btf_tag_info',
    //   page: '1',
    //   pagesize: '9999'
    // });

  }
  clickEventHandler(event) {

    this.isShow = true;
    if (!this.isAdd) {
      this.baseFormAdd.initData(event.event.origin);

    }
    this.treeNodeId = event.event.origin.id;
    this.baseFormAdd.disabled('id', true);
    this.baseFormAdd.disabled('par_tag_id', true);
    this.baseFormAdd.disabled('par_tag_name', true);
    // this.upd.isVisible = true;
  }

  buttonClick(event) {

    const obj = this.baseFormAdd.getData();
    if (!this.isAdd) {
      this.treeForm = obj;
    }
    switch (event) {
      case 'add':
        this.isAdd = true;
        this.baseFormAdd.setValue('par_tag_name', obj.tag_name);
        this.baseFormAdd.setValue('par_tag_id', obj.id);
        this.baseFormAdd.setValue('tag_name', null);
        this.baseFormAdd.setValue('tag_code', null);
        this.isexpandId = obj.id;
        this.baseFormAdd.setValue('tag_value', null);
        console.log(obj);
        break;
      case 'save':

        this.isexpandId = obj.id;
        if (this.isAdd) {
          obj.id = null;
          TransCommonApiHelper.insert(this, 'addTree', {
            tablename: 'btf_tag_info',
            data: obj
          });
        } else {
          TransCommonApiHelper.update(this, 'updateTree', {
            tablename: 'btf_tag_info',
            data: obj
          });
        }

        break;
      case 'del':
        if (this.isAdd) {
          this.isAdd = false;
          this.baseFormAdd.initData(this.treeForm);
          console.log(this.treeForm);
        } else {
          this.isexpandId = obj.par_tag_id;
          this.modelService.confirm({
            nzTitle: '是否确认删除?',
            nzOkText: '确定',
            nzOkType: 'danger',
            nzOnOk: () => {
              TransCommonApiHelper.delete(this, 'deleteTree', {
                tablename: 'btf_tag_info',
                id: [this.treeNodeId]
              });
            },
            nzCancelText: '取消',
            nzOnCancel: () => console.log('Cancel')
          });
        }
        break;
    }
  }
  treeEvent(event) {
    event.event.node.children.forEach(element => {
      if (element.children.length > 0) {
        element.origin.icon = 'folder';
      } else {
        element.origin.icon = 'file';
      }
    });


  }


  // super.skipSonRoute('tx990500', {
  //   it: event,
  // });
  // }
}
