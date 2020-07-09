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

const transCode = 'tx990241';
const transName = '定时任务';
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
  selector: 'app-tx990241',
  templateUrl: './tx990241.component.html',
  styleUrls: ['./tx990241.component.css'],
})
export class Tx990241Component extends BaseTransaction {
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
  loading = true;
  isFixed = 'CRON';
  data = [
    {
      job_name: '系统日切',
      trigger_type: '任意的Java方法任务',
      description: '',
      trigger_state: true,
      showDetail: false,
      status: {
        label: '',
        src: ''
      }
    }
  ];
  isVisible = false;
  isEdit = false;
  gridStyle = {
    width: '25%',
    padding: '2px 1px 0 1px !important'
  };
  isclick = false;
  nzSelectedIndex = 0;
  tabs = [
    {
      name: '每日',
      index: 'day',
      time: new Date(0, 0, 0, 0, 0, 0),
      weeks: '?',
      dayofMonth: '*',
      month: '*',
      dayofWeek: null,
      year: '*',
    }, {
      name: '每周',
      index: 'week',
      weeks: null,
      time: new Date(0, 0, 0, 0, 0, 0),
      dayofMonth: '?',
      month: '*',
      dayofWeek: null,
      year: '*',

    }, {
      name: '每月',
      index: 'month',
      time: new Date(0, 0, 0, 0, 0, 0),
      weeks: '?',
      dayofMonth: '*',
      month: '*',
      dayofWeek: null,
      A: {
        dayofMonth: null,
      },
      B: {
        dayofMonth: null,
      },
      year: '*',
    }, {
      name: '每年',
      index: 'year',
      time: new Date(0, 0, 0, 0, 0, 0),
      weeks: '?',
      dayofMonth: '*',
      month: '*',
      dayofWeek: null,
      A: {
        dayofMonth: null,
        month: null
      },
      B: {
        month: null,
        dayofMonth: null,
      },
      year: '*',
    }
  ];
  checkOptionsOne = [
    { label: '星期日', value: '7' },
    { label: '星期一', value: '1' },
    { label: '星期二', value: '2' },
    { label: '星期三', value: '3' },
    { label: '星期四', value: '4' },
    { label: '星期五', value: '5' },
    { label: '星期六', value: '6' },
  ];
  days = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
  ];
  months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  weekNum = ['1', '2', '3', '4'];
  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    marginButtom: '16px'
  };
  img = this.ifearm.imgSrc;
  status = {
    ACQUIRED: {
      src: this.ifearm.imgSrc + 'assets/image/on.png',
      label: '执行中'
    },
    WAITING: {
      src: this.ifearm.imgSrc + 'assets/image/watting.png',
      label: '等待'
    },
    PAUSED: {
      src: this.ifearm.imgSrc + 'assets/image/pause.png',
      label: '暂停'
    },
    BLOCKED: {
      src: this.ifearm.imgSrc + 'assets/image/BLOCKED.png',
      label: '阻塞'
    },
    ERROR: {
      src: this.ifearm.imgSrc + 'assets/image/off.png',
      label: '错误'
    },
    COMPLETE: {
      src: this.ifearm.imgSrc + 'assets/image/ok.png',
      label: '完成',
    }
  };
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  radioValue = 'A';
  detail: any;
  visible = false;
  isShow = false;
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

  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent, this.sonRouteEvent);
    this.getList();


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

  changeStatus(event) {

    if (event.trigger_state === 'WAITING' || event.trigger_state === 'PAUSED' || event.trigger_state === 'ACQUIRED') {
      console.log(event);
      let str;
      let strCn;
      if (event.trigger_state === 'WAITING' || event.trigger_state === 'ACQUIRED') {
        str = 'pause';
        strCn = '暂停';
      } else if (event.trigger_state === 'PAUSED') {
        str = 'resume';
        strCn = '恢复';
      }
      this.modelService.confirm({
        nzTitle: '确定' + strCn + '当前此项任务吗？',
        nzOnOk: () => {
          this.pauseJob(event, str);
        }
      });
    }


  }
  getTrigger(event) {
    if (event.isclick === false) {
      this.modelService.confirm({
        nzTitle: '确定执行一次当前此项任务吗？',
        nzOnOk: () => {
          const serviceRequest: ServiceRequest = {
            svctype: ServiceTypeEnum.GOV,
            funccode: 'trigger',
            svccode: '',
            requestdata: {
              coh: {}, bdy: {
                jobname: event.job_name
              }
            }
          };
          event.isclick = true;
          this.bsaApi.asynCall(serviceRequest).subscribe(data => {
            if (data.returncode === '000000') {
              event.isclick = false;
              console.log(event.detail);
              this.notification.create('success', data.returnmessage, '');
            }
          });
        }
      });

    } else {
      this.notification.create('warning', '请勿重复点击！', '');

    }

  }
  pauseJob(event, type) {
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.GOV,
      funccode: type,
      svccode: '',
      requestdata: {
        coh: {}, bdy: {
          jobname: event.job_name
        }
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        this.getList();
        console.log(event.detail);

      }
    });
  }

  handleOk() {
    // const smh = '0 0 0';
    let str;
    const obj = this.tabs[this.nzSelectedIndex];
    const time = this.datePipe.transform(obj.time, 'HH:mm:ss');
    const timeArray = time.split(':');
    const smh = timeArray[2] + ' ' + timeArray[1] + ' ' + timeArray[0];

    switch (obj.index) {
      case 'month':
        if (this.radioValue === 'A') {
          str = smh + ' ' + obj.A.dayofMonth + ' ' + obj.month + ' ' + obj.weeks + ' ' + obj.year;
        } else {
          str = smh + ' ' + obj.dayofMonth + ' ' + obj.month + ' ' + obj.dayofWeek + '#' + obj.B.dayofMonth + ' ' + obj.year;
        }
        break;
      case 'year':
        if (this.radioValue === 'A') {
          str = smh + ' ' + obj.A.dayofMonth + ' ' + obj.A.month + ' ' + obj.weeks + ' ' + obj.year;
        } else {
          str = smh + ' ' + obj.dayofMonth + ' ' + obj.B.month + ' ' + obj.dayofWeek + '#' + obj.B.dayofMonth + ' ' + obj.year;
        }
        break;
      default:
        str = smh + ' ' + obj.dayofMonth + ' ' + obj.month + ' ' + obj.weeks + ' ' + obj.year;
        break;
    }

    const form = this.baseForm.getData();
    const re = new RegExp('^\\s*($|#|\\w+\\s*=|(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)\\s+(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?)*)\\s+(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)\\s+(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\\s+(\\?|\\*|(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\\s)+(\\?|\\*|(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?)*))$'); // RegExp是一个对象,和Aarray一样  
    if (!re.test(str) ) {
        this.notification.info('表达式错误，请再次检查表达式', '');
     return;
     }
    let bdyarr = {};
    if (this.isFixed === 'CRON') {
      for (let i in form) {
        console.log(i);
        if (i !== 'repeatcount' && i !== 'repeatinterval') {
          bdyarr[i] = form[i];
        }
      }
      bdyarr['cron'] = str;

    } else {
      for (let i in form) {
        console.log(i);
        if (i !== 'cron') {
          bdyarr[i] = form[i];
        }
      }


    }
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.GOV,
      funccode: 'save',
      svccode: '',
      requestdata: {
        coh: {}, bdy: bdyarr
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        this.notification.create('success', '保存成功', '');
        this.isVisible = false;
        this.getList();
      } else {
        this.notification.create('error', data.returnmessage, '');
      }
    });

  }
  clickIcon(event) {
    this.isVisible = true;
    this.baseForm.initData();
    this.baseForm.setValue('TRIGGER_TYPE', 'CRON');
    // this.baseForm.disabled('TRIGGER_TYPE', true);
    this.isFixed = 'CRON';
    this.nzSelectedIndex = 0;
    if (event) {
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
  }
  checkslog(event, pr) {
    console.log(event);
    let obj; obj = [];
    event.forEach(i => {
      if (i.checked) {
        obj.push(i.value);
      }
    });
    const strObj = obj.join(',');
    pr.weeks = strObj;
    console.log(this.tabs);

    console.log(this.tabs[this.nzSelectedIndex]);
  }
  setString(str) {
    const obj = str.split(' ');
    console.log(obj);
    let arr = '';
    if ((obj[3] === '*' || obj[3] === '?') && obj[4] === '*' && (obj[5] === '*' || obj[5] === '?')) {
      arr = '每天' + obj[2] + ':' + obj[1] + ':' + obj[0] + '触发';
    } else if (obj[3] === '?' && obj[4] === '*' && (obj[5] !== '*' || obj[5] !== '?')) {
      if (obj[5].indexOf('#') !== -1) {
        const week = obj[5].split('#');
        this.commonFor(week)
        arr = '每个月' + '第' + week[0] + '个周的' + week[1] + obj[2] + ':' + obj[1] + ':' + obj[0] + '触发';
      } else {
        const week = obj[5].split(',');
        let weekarr; weekarr = [];
        this.checkOptionsOne.forEach(i => {
          week.forEach(j => {
            if (j === i.value) {
              weekarr.push(i.label);
            }
          });
        });
        arr = '每个' + weekarr.join('、') + obj[2] + ':' + obj[1] + ':' + obj[0] + '触发';
      }
    } else if ((obj[3] !== '*' || obj[3] !== '?') && obj[4] === '*' && obj[5] === '?') {
      arr = '每个月' + obj[3] + '号' + obj[2] + ':' + obj[1] + ':' + obj[0] + '触发';
    } else if ((obj[3] !== '*' || obj[3] !== '?') && obj[4] !== '*' && obj[5] === '?') {
      arr = '每年' + obj[4] + '月' + obj[3] + '号' + obj[2] + ':' + obj[1] + ':' + obj[0] + '触发';
    } else if (obj[3] === '?' && obj[4] !== '*' && (obj[5] !== '*' || obj[5] !== '?')) {
      const week = obj[5].split('#');
      this.commonFor(week);
      arr = '每年' + obj[4] + '月' + '第' + week[0] + '个周的' + week[1] + obj[2] + ':' + obj[1] + ':' + obj[0] + '触发';

    } else if (obj[0] === '*' && obj[1] === '*' && obj[2] === '*' && obj[3] === '*' && obj[4] === '*' && obj[5] === '*') {
      arr = '每秒执行';
    }
    return arr;

  }


  // 公共方法提取
  commonFor(week) {
    this.checkOptionsOne.forEach(i => {
      if (i.value === week[1]) {
        week[1] = i.label;
      }
    });
  }
  tabChange(event) {
    console.log(this.tabs[event]);
    if (this.tabs[event].index === 'week') {
      this.tabs[event].dayofMonth = '?';
    } else if (this.tabs[event].index === 'day') {
      this.tabs[event].weeks = '?';
    }
  }
  changesValue(event) {
    console.log(event);
    if (event.triggertype !== null) {
      this.isFixed = event.triggertype;

    }

  }
  getList() {
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.GOV,
      funccode: 'listjob',
      svccode: '',
      requestdata: { coh: {}, bdy: {} }
    };
    this.loading = true;
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      console.log(data);
      data.resultdata.bdy.forEach(i => {
        i.status = this.status[i.trigger_state];
        i.showDetail = false;
        i.isclick = false;
        i.detail = {};
      });
      const objdata = data.resultdata.bdy;
      this.data = this.getArr('4', objdata);
      if (objdata.length > 0) {
        this.isShow = true;
      } else {
        this.isShow = false;

      }

      console.log(this.data);
      this.loading = false;

    });
  }
  getArr(N, Q) {
    let R, F; R = [];
    for (F = 0; F < Q.length;) {
      R.push(Q.slice(F, F += N));
    }
    return R;
  }
  del(event) {
    console.log(event);

    this.modelService.confirm({
      nzTitle: '请确认是否删除此项定时任务',
      nzOnOk: () => {
        const serviceRequest: ServiceRequest = {
          svctype: ServiceTypeEnum.GOV,
          funccode: 'remove',
          svccode: '',
          requestdata: {
            coh: {}, bdy: {
              jobname: event.job_name
            }
          }
        };
        this.bsaApi.asynCall(serviceRequest).subscribe(data => {
          if (data.returncode === '000000') {
            this.getList();
            this.notification.create('success', '删除成功', '');
          }
        });
      }
    });

  }
  changeRadio(event, type) {
    if (type.index === 'month') {
      if (event === 'A') {
        type.weeks = '?';
        type.month = '*';
      } else {
        type.month = '*';
        type.dayofMonth = '?';
      }
    } else {
      if (event === 'A') {
        type.weeks = '?';
      } else {
        type.dayofMonth = '?';
      }
    }
  }
  getDetail(event) {
    const serviceRequest: ServiceRequest = {
      svctype: ServiceTypeEnum.GOV,
      funccode: 'detailjob',
      svccode: '',
      requestdata: {
        coh: {}, bdy: {
          jobname: event.job_name,
          triggertype: event.trigger_type
        }
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(data => {
      if (data.returncode === '000000') {
        event.detail = data.resultdata.bdy[0];
        if (event.detail.cron_expression !== undefined) {
          // const obj = event.detail.cron_expression.split(' ');
          event.detail.label = this.setString(event.detail.cron_expression);
          this.visible = true;
        }
        event.showDetail = !event.showDetail;
        console.log(event.detail);
      }
    });
  }
}
