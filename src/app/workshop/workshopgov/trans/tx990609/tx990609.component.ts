import { Component, OnInit, ViewChild } from '@angular/core';
import {
  BaseTransaction,
  CommonActionCodeContants,
  ShareParamsService,
  TransactionActionApiService,
  TransactionActionData,
  TransactionActionDefManager,
  TransactionDefManager
} from 'tms-platform';
import { FormComponent } from 'tms-platform-component';
import { ContextService } from '../../../../workshop/context/context.service';
import { timingSafeEqual } from 'crypto';
import {BsaApi, DcsApi, NativeApi, ServiceRequest, ServiceTypeEnum} from 'tms-platform';
import { unsupported } from '@angular/compiler/src/render3/view/util';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
@Component({
  selector: 'app-tx990609',
  templateUrl: './tx990609.component.html',
  styleUrls: ['./tx990609.component.css']
})
export class Tx990609Component  implements OnInit {

  constructor(
    private shareParamsService: ShareParamsService,
    public transactionActionApiService: TransactionActionApiService,
    private workShopContextService: ContextService,
    private bsapi: BsaApi,
    private nzNotificationService: NzNotificationService,
    private modal: NzModalService
  ) {
  }

  @ViewChild('baseForm_1', { static: true })
  baseForm_1: FormComponent;
  typeDefault = '';  // 参数类别的值
  valueDefault = ''; // 参数值
  number = 1;
  ngOnInit() {
  }
  submit = () => {
    this.addgetdata();
  }
  messageChange = e => {
    console.log(e,'测试');
    if (e !== undefined && e !== '') {
      this.getdata();
    }
  }
  addgetdata = () => {
    const serviceRequest: ServiceRequest = {
      'svccode': 'TX550002',
      'funccode': 'configupdate',
      'svctype': '0',
      'requestdata': {
        'coh': {},
        'bdy': {
          'cfgparam':  this.typeDefault,
          'cfgvalue': this.valueDefault
        }
      }
    };
    this.bsapi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        this.nzNotificationService.success('成功', '修改成功');
      } else {
        this.nzNotificationService.success('失败', '修改失败');
      }
    });
  }
  getdata = () => {
    const serviceRequest: ServiceRequest = {
      'svccode': 'TX550002',
      'funccode': 'configdetail',
      'svctype': '0',
      'requestdata': {
        'coh': {},
        'bdy': {
          'cfgparam': this.typeDefault,
          'cfgvalue': ''
        }
      }
    };
    this.bsapi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        this.valueDefault = items.resultdata.bdy.data;
      } else {
        this.nzNotificationService.error('失败', '查询失败');
      }
    });
  }
  isVIsiable = false;
  getfen = () => {
    if (/^[0-9]*$/.test(this.valueDefault)) {
      this.isVIsiable = false;
    } else {
      this.isVIsiable = true;
    }
  }

}
