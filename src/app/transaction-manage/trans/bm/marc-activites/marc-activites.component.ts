import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Transaction } from '../../../decorators/transaction.decorator';
import { TransactionContext } from '../../../context/transaction.context';
import { CrudTransaction } from '../../crud-transaction';
import { Observable } from 'rxjs';
import { FormComponent } from 'tms-platform-component';
import { SettingService } from '../../../../service/setting.service';
import { BaseTransaction } from '../../base-transaction';
import { TransactionContextHelper } from '../../../context/transaction.context.helper';
const transCode = 'tx001000';
const transName = 'H5模板管理';
const tableName = '';
const exFuncCode = [];
const funcCode = CrudTransaction.BASE_FUNC.concat(exFuncCode);
const options = {};

@Transaction({
  transCode: transCode,
  transName: transName,
  funcCode: funcCode
})
@Component({
  selector: 'app-marc-activites',
  templateUrl: './marc-activites.component.html',
  styleUrls: ['./marc-activites.component.css']
})
export class MarcActivitesComponent extends BaseTransaction {
  @ViewChild('baseForm', {static: true})
  baseForm: FormComponent;
  isVisibleImg = false; // 默认弹出框关闭
  isVisibleTitle = false;
  imgTitle: string;
  imgid: string;
  txttitle: string;
  uploadedFiles: any[] = [];

  // 图片信息
  imgJson = {
    bannerSrc: './assets/image/nmBanner.jpg', // banner图信息
    shopSrc: './assets/image/goBtn.jpg',
    goawardSrc: './assets/image/goBtn.jpg',
    myawardSrc: './assets/image/receive.png'
  };

  text: string = '<div>Hello World!</div><div>PrimeNG <b>Editor</b> Rocks</div><div><br></div>';


  titleJson = {
    details: {key: '仅限内蒙古地区新用户', value: '2017年11月10日0：00-12月31日23：59：59', title: '活动详情'},
    desc:  {key: '1元起购，每位客户每日申购上限均为500万元；', value: '1000元起购，追加金额为0.01元，每位客户每日申购上限为1000万元。', title: '产品说明'},
    rule: {key: '仅限内蒙古地区新用户', value: '2017年11月10日0：00-12月31日23：59：59', title: '活动规则'},
  };


  tabs = [
    {key: 'xc', label: '宣传页'},
    {key: 'yz', label: '验证页'},
    {key: 'mya', label: '我的奖品一'},
    {key: 'myb', label: '我的奖品二'},
  ];


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
  constructor(public settingService: SettingService
  ) {
    super(transCode);
  }

  onEnterAfter(): void {
    super.initBase(this.transactionContextChangeOb, this.submitEvent);

  }
  listDataCallback(data: any): void {
  }

  onTransactionContextChange(tcFuncCode, transactionContext, transCode?) {
    /*TransactionContextHelper.getServiceResult(
      transactionContext,
      tcFuncCode,
      transCode
    ).resultdata;*/
  }


  buttonEdit(id) {
    console.log(id);
    this.isVisibleTitle = true;
  }

  editImg(id) {
   this.imgid = id;
   switch (id) {
      case 'banner':
        this.imgTitle = '上传—banner图片';
        break;
      case 'goAward':
        this.imgTitle = '上传—去领奖图片';
        break;
        case 'myAward':
        this.imgTitle = '上传—我的奖品图片';
        break;
    };
   this.isVisibleImg = true;
  }


  ceshiimg($event: Event) {
    this.imgid  = 'goshop';
    this.imgTitle = '上传—立即购买图片';
    this.isVisibleImg = true;
    $event.stopPropagation(); // 阻止函数冒泡
  }


  changeImgOk() {
    switch (this.imgid) {
      case 'banner':
        this.imgJson.bannerSrc = './assets/image/timg.jpg';
        break;
        case 'goshop':
       this.imgJson.shopSrc = './assets/image/shop.jpg';
        break;
      case 'goAward':
        this.imgJson.goawardSrc = './assets/image/cs.jpg';
        break;
      case 'myAward':
        this.imgJson.myawardSrc = './assets/image/ces2.jpg';
        break;
    }
    this.isVisibleImg = false;
  }


  /*更换图片函数*/
  reVerifycode() {
      console.log('图片更换完成')
  }


  submit() {
    console.log('提交验证码申请')
  }


  changeImg() {
    alert('领奖')
  }
}
