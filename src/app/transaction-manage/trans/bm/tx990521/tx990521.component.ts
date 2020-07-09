import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
import { IfearmService } from '../../../../service/ifearm.service';
import {Tx990522Component} from "../tx990522/tx990522.component";
import {HttpClient} from "@angular/common/http";
import {HttpService} from "tms-platform";
const transCode = 'tx990521';
const transName = '工作站监控详情';
const tableName = 'BTF_TRANS_JNL';
const exFuncCode = ['queryCode'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {
  header: [],
  tableName: tableName
};
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode,
  options: options,
  subTransCodes: ['tx990522']
})
@Component({
  selector: 'app-tx990521',
  templateUrl: './tx990521.component.html',
  styleUrls: ['./tx990521.component.css']
})
export class Tx990521Component extends CrudTransaction  implements OnDestroy{
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  @ViewChild('tx990522', {static: true})
  tx990522: Tx990522Component;
  @Input('params') params: any;

  @Input('transactionContextChangeOb')
  transactionContextChangeOb: Observable<{ tcFuncCode: string, transactionContext: TransactionContext }>;
  @Output('sonRouteEvent') sonRouteEvent: EventEmitter<{ type: string, transCode: string, params: any }> = new EventEmitter();
  @Output('submitEvent')
  submitEvent: EventEmitter<{ svcCode: string, tcFuncCode: string, funcCode: string, bdy: any }> = new EventEmitter();
  img = this.ifearm.imgSrc;
  stationCode: string; // 拿到传递过来的工作组code 来调用接口
  workDetails = {
    workstationCode: '',
    versionNo : "", // 序号
    workstationName: "", // 工作站名称
    orgCode: "", // 组织机构代码
    channelCode: "", // 渠道代码
    workstationKind: "", // 工作站类别
    masterFlag: "", // 主从站标志
    workstationIp: "", // 工作站IP
    msgpushPort: "", // 地址端口
    workstationStatus: '', // 工作站状态
    workstationSwitch: '', // 工作站开关
    setDate: '', // 设置时间
    shutoutDate: '', // 启营时间
    suitCode: ' ', // 套装代码
    lastDate: '' // 最后登录时间
  }; // 工作站详情信息
  runninglog: any; // 工作站日志信息
  declineTime: any; // 时间查询工作站信息
  peripheral = []; // 外设信息存储
  real = {
    maxMemory: '',
    freeMemory: '',
    totalMemory: '',
    time: ''
  } // 外设请求数据保存
  realStauts: boolean;
  constructor(public settingService: SettingService,
              private ifearm: IfearmService,
              private notification: NzNotificationService, private modelService: NzModalService,private http: HttpClient,
              private httpService:HttpService) {
    super(transCode);
  }
  onEnterAfter(): void {
    super.initCrud({
      transactionContextChangeOb: this.transactionContextChangeOb,
      submitEvent: this.submitEvent,
      baseForm: this.baseForm,
      notification: this.notification, modelService: this.modelService, sonRouteEvent: this.sonRouteEvent
    });
    this.stationCode = this.params['workstationCode'];
    this.initworkInfo(); // 调用工作站详情接口
    this.initreal(); // 调用外设信息方法
    //  轮询调用外设信息方法
    this.declineTime = setInterval(() => {
      this.initreal();
    }, 20 * 1000);
    this.tx990522.onEnterAfter(this.stationCode); // 调用子组件交易管理

  }

  listDataCallback(data: any): void {

  }
  onCrudTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    );
    // 调用子组件必须调用这个
    const parse = TransactionContextHelper.parseFuncCode(tcFuncCode);
    if (parse.name === Tx990522Component.name) {
      this.tx990522.onTransactionContextChange(parse.funcCode, transactionContext, 'tx990522');
      return;
    }
  }



  // 字符串转对象方法
  toString(str) {
    let objArray  = str.split(','); // 转成数组
    let obj = {}; // 接收对象的数据
    objArray.map(function(value) { // 分割成对象
      const str = value.split(':');
      if (str[0] === 'alarmTimeE' || str[0] === 'alarmTimeB') { // 因为是时间，被分割成四项了，所以单独处理
        obj[str[0]] = str[1] + ':' +  str[2] + ':' +  str[3]
      } else {
        obj[str[0]] = str[1]
      }
    });
    return obj;
  }


  // 调用子组件必须调用这个
  submitTx990522EventHandler(event: {svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}) {
    super.submit(event.svcCode, TransactionContextHelper.formatFuncCode('tx990522', event.tcFuncCode), event.funcCode, event.bdy);
  }


  onAddActionBefore(): void {
  }

  // 查询工作站详情
  initworkInfo() {
    this.httpService.get('https://api.brons.top/workstations/' + this.stationCode)
      .subscribe(res => {
          this.workDetails = res['workstation']; // 还有一个instance字段，代表工作站的信息 ----当前的状态注册信息 还没想好放在那里，先预留记录下, 样式改版之后，用图形展示
          this.runninglog = res['event'].reverse();
        }
      );
  }

  // 轮询查询实时信息  --- 拿到外设信息
  initreal() {
    this.httpService.get('https://api.brons.top/workstations/' + this.stationCode + '/real')
      .subscribe(res => {
          if(res['status'] === 'success') { // 有设备链接才展示
            this.realStauts = false; // 有设备链接
            console.log(res)
            this.real = res['info'];
            let objS = JSON.parse(this.real['deviceInfo']);
            for(let i in objS){ //json循环
              this.peripheral.push(objS[i])
            }
            this.peripheral.forEach((item) => {
              if(item.info['retCode'] == '000000') {
                item.status = '成功'
              } else {
                item.status = '失败'
              }
            })
          } else {
            this.realStauts = true; // 无设备链接
          }
        }
      );
  }


  // 销毁
  ngOnDestroy() {
    clearInterval(this.declineTime);
  }

}


