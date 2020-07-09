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
import { TransactionContextHelper } from 'src/app/transaction-manage/context/transaction.context.helper';
import { TransCommonApiHelper } from '../../trans-common-api-helper';
import { trigger, state, transition, style, animate } from '@angular/animations';
const transCode = 'tx990518';
const transName = '首页';
const tableName = ' ';
const exFuncCode = ['listQuery', 'transQuery', 'orgQuery', 'userQuery', 'inmenuQuery'];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};
const nullO = null;
@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-tx990518',
  templateUrl: './tx990518.component.html',
  styleUrls: ['./tx990518.component.css'],
  animations: [
    trigger('square',//trigger的名称
      [
        state('green', style({ opacity: 0 })),
        state('red', style({ opacity: 1 })),
        transition('red => green', animate(1000)),
        transition('green => red', animate(1000))
      ]
    )
  ]
})
export class Tx990518Component extends BaseTransaction {
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
  styleDiv = {
    padding: '24px 0 0 0',
    border: '3px solid #2570BE',
    borderRadius: '8px',
    margin: ' 2rem 0'
  };
  styleDivChart = {
    padding: '24px 0 0 0',
  };
  temp = false;
  optionsIT = {};
  optionsLine = {};
  topData = [
    { text: '交易', icon: 'pie-chart', index: 0, src: './assets/bmimage/BM1/bg_jiaoyi@2x.png', iconimg: './assets/bmimage/BM1/icon_jiaoyi@2x.png' },
    { text: '员工', icon: 'project', index: 1, src: './assets/bmimage/BM1/bg_yuangong@2x.png', iconimg: './assets/bmimage/BM1/icon_yuangong@2x.png' },
    { text: '机构', icon: 'team', index: 2, src: './assets/bmimage/BM1/bg_jigou@2x.png', iconimg: './assets/bmimage/BM1/icon_jigou@2x.png' },
  ];
  centerData = [
    {
      icon: 'team',
      img: './assets/bmimage/BM1/icon_yuangongshu@2x.png',
      text: '员工数',
      value: '---',
      color: {

      }
    },
    {
      icon: 'notification',
      img: './assets/bmimage/BM1/icon_jiaoyizongshu@2x.png',
      text: '交易总数', value: '---',
      color: {

      }
    },
    {icon: 'project',
     img: './assets/bmimage/BM1/icon_jigouzongshu@2x.png',
      text: '机构总数',
      value: '---',
      color: {

      }
    },
    {
      icon: 'pic-right',
      img: './assets/bmimage/BM1/icon_yonghuzongshu@2x.png',
      text: '用户总数', value: '---',
      color: {
        // backgroundColor: '#61a0a8'
      }
    }
  ];
  gridStyle = {
    textAlign: 'center'
  };
  channel = [];
  channelObj = [];
  nzSpanLength = 6;
  right: any;
  left: any;
  constructor(public settingService: SettingService,
    private notification: NzNotificationService,
    private modelService: NzModalService,
    private http: HttpClient,
    private elementRef: ElementRef,
    private router: Router,
    private datePipe: DatePipe,
    private bsaApi: BsaApi,
    private ifearm: IfearmService,
  ) {
    super(transCode);
  }
  //[@trigger名称]的对应内容

  changeInfo(event, type) {//改变trigger的state
    console.log(type);

    event.squareString = type;
  }

  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);
    this.getList();
    this.getteam();
    this.getnotification();
    this.getproject();
    this.getinmenu();

  }

  listDataCallback(data: any): void {
  }


  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    let result;
    result = TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    );
    switch (tcFuncCode) {
      case 'listQuery':
        console.log(result);

        this.channel = result.resultdata.bdy.data;
        if (this.channel.length < 7 && this.channel.length !== 5) {
          this.nzSpanLength = 24 / this.channel.length;
        } else {
          this.nzSpanLength = 4
        }

        this.setChannel();

        break;
      case 'transQuery':
        this.centerData[1].value = result.resultdata.bdy.count;
        console.log(result);

        break;
      case 'orgQuery':
        console.log(result);
        this.centerData[2].value = result.resultdata.bdy.count;

        break;
      case 'userQuery':
        console.log(result);
        this.centerData[3].value = result.resultdata.bdy.count;

        break;
      case 'inmenuQuery':
        console.log(result);
        this.centerData[0].value = result.resultdata.bdy.count;

        break;
    }


  }
  getList() {
    TransCommonApiHelper.conditionQuery(this, 'listQuery', { tablename: 'btf_branch_channel', page: '1', pagesize: '999' });

  }
  getteam() {
    TransCommonApiHelper.conditionQuery(this, 'transQuery', { tablename: 'btf_trans_info', page: '1', pagesize: '1' });

  }
  getnotification() {
    TransCommonApiHelper.conditionQuery(this, 'orgQuery', { tablename: 'btf_org_info', page: '1', pagesize: '1' });

  }
  getproject() {
    TransCommonApiHelper.conditionQuery(this, 'userQuery', { tablename: 'btf_user_info', page: '1', pagesize: '1' });

  }
  getinmenu() {
    TransCommonApiHelper.conditionQuery(this, 'inmenuQuery', { tablename: 'btf_trans_inmenu', page: '1', pagesize: '1' });

  }
  setChannel() {
    this.channel.forEach((i, j) => {
      i.ishow = true;
      if (j < 6) {
        i.ishowCase = true;
      } else {
        i.ishowCase = false;
      }
      i.squareString = 'green';

      this.channelObj.push(i);

    });
    this.left = 0;
    if (this.channelObj.length > 6) {
      this.right = 5;
    } else {
      this.right = this.channelObj.length - 1;

    }
    console.log(this.channelObj);
  }
  cardClick(event) {
    console.log(event);
    switch (event.index) {
      case 0:
        this.router.navigate(['gov/dashbord/transaction/tx990231'], {
          // queryParams: { workGuid: event.guid }
        });
        break;
      case 1:
        this.router.navigate(['gov/dashbord/transaction/tx990351'], {
          // queryParams: { workGuid: event.guid }
        });
        break;
      case 2:
        this.router.navigate(['gov/dashbord/transaction/tx990211'], {
          // queryParams: { workGuid: event.guid }
        });
        break;
    }
  }
  iconClick(type) {

    if (this.channelObj.length > 6) {
      if (type === 'R' && this.right < this.channelObj.length - 1) {


        this.channelObj[this.left].ishowCase = false;
        this.channelObj[(this.right + 1)].ishowCase = true;
        this.left = this.left + 1;
        this.right = this.right + 1;
        console.log(this.channelObj);

      } else if (type === 'L' && this.left > 0) {
        this.channelObj[(this.left - 1)].ishowCase = true;
        this.channelObj[this.right].ishowCase = false;
        this.left = this.left - 1;
        this.right = this.right - 1;

      }
    }
  }
}
