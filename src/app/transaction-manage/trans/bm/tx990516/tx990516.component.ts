import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';
import { BaseTransaction } from '../../base-transaction';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BsaApi, ServiceRequest, ServiceTypeEnum } from 'tms-platform';
import { IfearmService } from '../../../../service/ifearm.service';
import { GlobalService } from 'src/app/service/global.service';

const transCode = 'tx990516';
const transName = '版本中心';
const tableName = ' ';
const exFuncCode = ['listQuery'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};
const nullO = null;
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990516',
  templateUrl: './tx990516.component.html',
  styleUrls: ['./tx990516.component.css'],

})
export class Tx990516Component extends BaseTransaction {
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
  @Input('params') params: any;

  constructor(public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    public global: GlobalService,
    private router: Router,
    private datePipe: DatePipe,
    private bsaApi: BsaApi,
    private ifearm: IfearmService
  ) {
    super(transCode);
  }
  action=  this.global.ipserver + this.global.apiport+'/content/file/uploadBatch';
  nzOptions = [];
  visible = false;
  out = false;
  values: any[] = null;
  isTms = false;
  isSearch = false;
  istmsSearch = false;
  tmsList = [];
  imgList = [];
  isEdit = false;
  fileData = {
    user: ''
  };
  valuesServe: any[] = [];
  headers = {
    Authorization: ''
  };
  ShowUploadList = false;
  imgCurrentPage = 1;
  tmsCurrentPage = 1;
  isSpinning = '';
  istmsSpinning = '';
  imgIsflage = true;
  tmsIsflage = true;
  files: any;
  app_name: string;
  tmsapp_name: string;
  server = [];
  serverList = [];
  serverObj = {
    server: {},
    imgObj: {}
  };
  isVisible = false;
  imgListObj = {};
  tmsListObj = {};
  isSpinningModal = false;
  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);
    this.getListimage();
    this.getDockerVersion();
    this.getTmsVersion();
    setTimeout(() => {
      this.out = true;
    });
    const user = sessionStorage.getItem('user');
    this.fileData.user = JSON.parse(user).user_code;
    const header = sessionStorage.getItem('header');
    this.headers.Authorization = JSON.parse(header).Authorization;
  }

  listDataCallback(data: any): void {
  }


  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    /*let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    );*/
    switch (tcFuncCode) {
      case 'listQuery':

        break;
    }
  }




  getArr(N, Q) {
    let R, F; R = [];
    for (F = 0; F < Q.length;) {
      R.push(Q.slice(F, F += N));
    }
    return R;
  }
  closeClick(event) {
    console.log(event);

    this.modelService.confirm({
      nzTitle: '请确认是否删除此版本',
      nzOnOk: () => {
        const serviceRequest: ServiceRequest = {
          svctype: ServiceTypeEnum.VERSION,
          funccode: 'remove',
          svccode: '',
          requestdata: {
            coh: {}, bdy: {
              id: event.id
            }
          }
        };
        this.bsaApi.asynCall(serviceRequest).subscribe(data => {
          if (data.returncode === '000000') {

            if (event.workstation_type === 'docker-images') {
              this.imgCurrentPage = this.retrunCurrent(event, this.imgList);
              this.getDockerVersion();
            } else {
              this.tmsCurrentPage = this.retrunCurrent(event, this.tmsList);

              this.getTmsVersion();
            }
            this.notification.create('success', '删除成功', '');
          }
        });
      }
    });

  }

  getListimage() {
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.VERSION,
      funccode: 'listimage',
      svccode: '',
      requestdata: {
        coh: {}, bdy: {

        }
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        this.nzOptions = [];

        data.resultdata.bdy.forEach(element => {
          let data = [];
          element.data.forEach(i => {
            data.push({ value: i, label: i, isLeaf: true })
          });
          this.nzOptions.push({ value: element.name, label: element.name, children: data })
        });

        console.log(this.nzOptions);

      }
    });


  }
  getTmsVersion(type?) {
    let bdy;
    bdy = {
      currentPage: this.tmsCurrentPage,
      itemsperpage: '6',
      not_work_type: 'docker-images'
    };
    if (type === 'search') {
      this.tmsCurrentPage = 1;
      bdy = {
        currentPage: this.tmsCurrentPage,
        itemsperpage: '6',
        not_work_type: 'docker-images',
        app_name: this.tmsapp_name
      };
    } else if (type === 'reset') {
      this.tmsapp_name = null;
      this.tmsCurrentPage = 1;
      bdy = {
        currentPage: this.tmsCurrentPage,
        itemsperpage: '6',
        not_work_type: 'docker-images'
      };
    }

    this.istmsSpinning = '数据正在加载...';

    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.VERSION,
      funccode: 'versioninfo',
      svccode: '',
      requestdata: {
        coh: {}, bdy: bdy
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        if (data.resultdata.bdy.version_list.length < 6) {
          this.tmsIsflage = false;
          this.istmsSpinning = '数据已全部加载';
        } else {
          this.tmsIsflage = true;
          this.istmsSpinning = '';
        }
        const obj = [];
        this.tmsList = [];
        data.resultdata.bdy.version_list.forEach(element => {
          element.hidden = true;
          obj.push(element);
        });
        console.log(this.tmsIsflage);
        this.tmsListObj[this.tmsCurrentPage] = obj;
        for (const key in this.tmsListObj) {
          if (this.tmsListObj.hasOwnProperty(key)) {
            this.tmsListObj[key].forEach(i => {
              this.tmsList.push(i);
            });
          }
        }
      }
    });
  }
  getDockerVersion(type?) {
    let bdy;
    bdy = {
      currentPage: this.imgCurrentPage,
      itemsperpage: '6',
      workstation_type: 'docker-images'
    };
    if (type === 'search') {
      this.imgCurrentPage = 1;

      bdy = {
        currentPage: this.imgCurrentPage,
        itemsperpage: '6',
        workstation_type: 'docker-images',
        app_name: this.app_name
      };
    } else if (type === 'reset') {

      this.app_name = null;
      this.imgCurrentPage = 1;
      bdy = {
        currentPage: this.imgCurrentPage,
        itemsperpage: '6',
        workstation_type: 'docker-images'
      };
    }
    this.isSpinning = '数据正在加载...';
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.VERSION,
      funccode: 'versioninfo',
      svccode: '',
      requestdata: {
        coh: {}, bdy: bdy
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        // this.imgList = [];
        if (data.resultdata.bdy.version_list.length < 6) {
          this.imgIsflage = false;
          this.isSpinning = '数据已全部加载';
        } else {
          this.isSpinning = '';
          this.imgIsflage = true;
        }
        const obj = [];
        this.imgList = [];
        data.resultdata.bdy.version_list.forEach(element => {
          element.hidden = true;
          element.version_md_file = element.version_md_file.split(':');
          obj.push(element);
        });
        this.imgListObj[this.imgCurrentPage] = obj;

        for (const key in this.imgListObj) {
          if (this.imgListObj.hasOwnProperty(key)) {

            this.imgListObj[key].forEach(i => {
              this.imgList.push(i);
            });
          }
        }

        console.log(this.imgList);
      }
    });
  }

  saveVesion() {
    const obj = this.baseForm.getData();
    if (!this.isTms) {
      obj.version_md_file = this.values[0] + ':' + this.values[1];
      delete obj.version_location;
    }
    let funccode = 'save';
    if (this.isEdit) {
      funccode = 'update';

    }
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.VERSION,
      funccode: funccode,
      svccode: '',
      requestdata: {
        coh: {}, bdy: obj
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        if (obj.workstation_type === 'docker-images') {
          if (funccode === 'update') {
            this.imgCurrentPage = this.retrunCurrent(obj, this.imgList);
          }
          this.getDockerVersion();
        } else {
          if (funccode === 'update') {
            this.tmsCurrentPage = this.retrunCurrent(obj, this.tmsList);
          }
          this.getTmsVersion();
        }

        this.notification.create('success', data.returnmessage, '');
        this.visible = false;
      }
    });
  }
  retrunCurrent(obj, data) {
    let currentPage = 1;
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        for (let i = 0; i < data[key].length; i++) {
          if (obj.id === data[key][i].id) {
            currentPage = Number(key);
            break;
          }
        }

      }
    }
    return currentPage;
  }
  changeInfo(event, type) {
    if (type === 'true') {
      event.hidden = false;
    } else {
      event.hidden = true;
    }
  }
  open(): void {
    this.visible = true;
    this.isEdit = false;
    this.ShowUploadList = false;
    this.files = [];
    this.baseForm.initData();
    this.baseForm.disabled('version_location', true);
    this.baseForm.disabled('version_status', true);
    this.baseForm.disabled('app_name', false);
    this.baseForm.disabled('version_no', false);
    this.baseForm.setValue('version_status', '2');
    this.baseForm.setValue('workstation_type', 'tms');
    this.values = [];

  }

  close(): void {
    this.visible = false;
  }
  onChanges(event) {
    console.log(event);
    this.values = event;
  }

  editClick(event) {
    console.log(event);
    this.isEdit = true;
    this.baseForm.setValue('app_name', event.app_name);
    this.baseForm.disabled('app_name', true);
    this.baseForm.disabled('version_no', true);
    this.baseForm.setValue('version_no', event.version_no);
    this.baseForm.disabled('version_status', false);
    this.baseForm.setValue('version_status', event.version_status);
    this.baseForm.setValue('app_port', event.app_port);
    this.baseForm.setValue('open_port', event.open_port);
    this.baseForm.setValue('workstation_type', event.workstation_type);
    if (event.workstation_type === 'docker-images') {
      this.values = event.version_md_file;
      this.isTms = false;
    } else {
      this.isTms = true;
    }
    this.visible = true;

  }
  changesValue(event) {

    if (event.workstation_type === 'docker-images') {
      this.isTms = false;
    } else {
      this.isTms = true;
      this.ShowUploadList = true;
    }
  }
  fileChange(event) {
    if (event.type === 'success') {
      if (event.fileList.length > 1) {
        event.fileList.splice(0, 1);
      }
      console.log(event.fileList[0].response.resultdata.filePath);
      this.baseForm.setValue('version_location', event.fileList[0].response.resultdata.filePath);
    }

  }
  moveFile = (file: File) => {
    console.log(this.files);
    this.files = [];
    this.baseForm.setValue('version_location', ' ');


  }
  imgScroll(event) {

    const scrollHeight = event.target.scrollHeight;
    const scrollTop = event.target.scrollTop;
    const clientHeight = event.target.clientHeight;
    if (scrollHeight - clientHeight === scrollTop && this.imgIsflage) {
      // 滚动条滚到最底部,
      this.imgCurrentPage++;
      this.getDockerVersion();

    }
  }
  tmsScroll(event) {

    const scrollHeight = event.target.scrollHeight;
    const scrollTop = event.target.scrollTop;
    const clientHeight = event.target.clientHeight;
    if (scrollHeight - clientHeight === scrollTop && this.tmsIsflage) {
      // 滚动条滚到最底部
      this.tmsCurrentPage++;
      this.getTmsVersion();
      console.log(this.tmsCurrentPage);
    }
  }
  searchClick(type) {
    if (type === 'i') {
      this.isSearch = !this.isSearch;
    } else {
      this.istmsSearch = !this.istmsSearch;

    }
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
        } else {
          this.server = [];
          this.serverList = data.resultdata.bdy;

          let array; array = {};
          this.serverList.forEach(i => {
            if (i.type === '1') {
              i.label = i.group_name;
            } else {
              i.label = i.server_name;
            }
            i.children = [];
            i.value = i.id;
            i.isLeaf = true;
            array[i.id] = i;
          });
          const arr = [];
          this.serverList.forEach((i, j) => {
            if (i.parent_id !== undefined) {
              // arr.push(i);
              array[i.parent_id].children.push(i);
              array[i.parent_id]['isLeaf'] = false;
            } else {
              this.server.push(i);
            }

          });
          console.log(this.server);


        }

      }
    });
  }
  publish(event) {
    this.isVisible = true;
    this.serverObj.imgObj = event;
    this.queryList();

  }
  onChangescascader(event) {
    const obj = event[event.length - 1];

    this.serverObj.server = {};
    this.serverList.forEach(i => {
      if (i.id === obj) {
        console.log(i);
        this.serverObj.server = i;
      }
    });
    console.log(this.serverObj);
  }
  handleOk() {
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.VERSION,
      funccode: 'amc_server',
      svccode: '',
      requestdata: {
        coh: {}, bdy: {
          data: {
            module: 'amc', operation: 'VersionManager',
            server_list: [{ user: this.serverObj.server['user'], pwd: this.serverObj.server['passwd'], ip: this.serverObj.server['ip'] }],
            image_name: 'amc-version-server',
            version: 'latest',
            open_port: '8023',
            app_port: '8023'
          }
        }
      }
    };
    console.log(serviceRequest);

    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        console.log(data);

      }
    });
  }

  handOk() {
    const url =  this.global.ipserver + ':27777/amc/interface';
    // tslint:disable-next-line: no-shadowed-variable

    const options = {
      module: 'amc', operation: 'VersionManager',
      server_list: [{ user: this.serverObj.server['user'], pwd: this.serverObj.server['passwd'], ip: this.serverObj.server['ip'] }],
      image_name: this.serverObj.imgObj['version_md_file'][0],
      version: this.serverObj.imgObj['version_md_file'][1],
      open_port: this.serverObj.imgObj['open_port'],
      app_port: this.serverObj.imgObj['app_port']
    };

    this.isSpinningModal = true;
    this.http.post(url, options).subscribe(
      res => {
        // this.isSpinningModal = false;
        let flage = 'success';
        if (!res['data'].server_flag) {

          flage = 'error';
        }
        this.notification.create(flage, res['data'].server_list[0]['ret_msg'], '');
      },
      error => {
        this.notification.create('error', '请求异常', '');

      }
    );
  }
}
