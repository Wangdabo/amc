import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { BsaApi, ServiceTypeEnum, ServiceRequest } from 'tms-platform';
import { UtilityService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-tx990612',
  templateUrl: './tx990612.component.html',
  styleUrls: ['./tx990612.component.css']
})
export class Tx990612Component implements OnInit {

  flag = 'test1';
  radioValue = 'A';
  checkStatusValue = 'A';
  checkStatus = '0';
  check_time = '';
  dateStr = '';
  Id = '';
  listOfData = [];
  rowActions = [
    {key: 'yes', label: '是'},
    {key: 'no', label: '否'}
  ];
  listHeader = [
    {key: 'area', label: '功能区域'},
    {key: 'checkItem', label: '项目设备'},
  ];
  listOfData1 = [
    {
      key: '1',
      area: '营业厅周边区域',
      checkItem: '干净的门前台阶，LED,外墙,营业时间牌',
      checkStatus: this.checkStatus
    },
    {
      key: '2',
      area: '营业厅周边区域',
      checkItem: '跑马灯，LED等宣传设备，内容更新及时',
      checkStatus: this.checkStatus
    },
    {
      key: '3',
      area: '引导区,客户等候区',
      checkItem: '干净的地面,台面,墙面,窗户,座椅',
      checkStatus: this.checkStatus
    },
    {
      key: '4',
      area: '引导区,客户等候区',
      checkItem: '干净的电子广告屏,宣传海报,宣传折页',
      checkStatus: this.checkStatus
    },
    {
      key: '5',
      area: '引导区,客户等候区',
      checkItem: '服务设施(叫机号,填机号)',
      checkStatus: this.checkStatus
    },
    {
      key: '6',
      area: '引导区,客户等候区',
      checkItem: '设施里打印纸充足',
      checkStatus: this.checkStatus
    },
    {
      key: '7',
      area: '引导区,客户等候区',
      checkItem: '视频内容合规',
      checkStatus: this.checkStatus
    },
  ];
  listOfData2 = [
    {
      key: '1',
      area: '引导区,客户等候区',
      checkItem: '服务设施(叫号机,填单机,计算机终端)',
      checkStatus: this.checkStatus
    },
    {
      key: '2',
      area: '引导区,客户等候区',
      checkItem: '设施打印纸充足',
      checkStatus: this.checkStatus
    },
    {
      key: '3',
      area: '引导区,客户等候区',
      checkItem: '提供饮用水',
      checkStatus: this.checkStatus
    },
    {
      key: '4',
      area: '引导区,客户等候区',
      checkItem: '有纸杯提供且摆放整齐',
      checkStatus: this.checkStatus
    },
    {
      key: '5',
      area: '引导区,客户等候区',
      checkItem: '有足量的书写笔',
      checkStatus: this.checkStatus
    },
    {
      key: '6',
      area: '引导区,客户等候区',
      checkItem: '空白凭条,缴费发票充足',
      checkStatus: this.checkStatus
    },
    {
      key: '7',
      area: '引导区,客户等候区',
      checkItem: '有备用的书写笔',
      checkStatus: this.checkStatus
    },
  ];
  listOfData3 = [
    {
      key: '1',
      area: '营业厅周边区域',
      checkItem: '干净的门前台阶，LED,外墙,营业时间牌',
      checkStatus: this.checkStatus
    },
    {
      key: '2',
      area: '营业厅周边区域',
      checkItem: '跑马灯，LED等宣传设备，内容更新及时',
      checkStatus: this.checkStatus
    },
    {
      key: '3',
      area: '引导区,客户等候区',
      checkItem: '干净的地面,台面,墙面,窗户,座椅',
      checkStatus: this.checkStatus
    },
    {
      key: '4',
      area: '引导区,客户等候区',
      checkItem: '自助设备正常运行,摆放整齐',
      checkStatus: this.checkStatus
    },
    {
      key: '5',
      area: '引导区,客户等候区',
      checkItem: '干净倒空的垃圾桶',
      checkStatus: this.checkStatus
    },
    {
      key: '6',
      area: '引导区,客户等候区',
      checkItem: '设施里打印纸充足',
      checkStatus: this.checkStatus
    },
    {
      key: '7',
      area: '引导区,客户等候区',
      checkItem: '服务电话可正常使用',
      checkStatus: this.checkStatus
    },
  ];
  constructor(private message: NzMessageService, private bsaApi: BsaApi, public utils: UtilityService) { }

  ngOnInit() {
    this.getDate();
  }
  select($event) {
    console.log($event);
    this.flag = $event;
  }
  // 判断检查时段
  commit() {
    console.log(this.flag);
    if (this.flag === 'test1') {
        this.Id = '1';
        this.check_time = '营业前',
        this.listOfData = this.listOfData1;
        this.addInfo();
        console.log(this.listOfData1);
    } else if (this.flag === 'test2') {
        this.Id = '2';
        this.check_time = '营业中',
        this.listOfData = this.listOfData2;
        this.addInfo();
    } else if (this.flag === 'test3') {
        this.Id = '3';
        this.check_time = '营业后',
        this.listOfData = this.listOfData3;
        this.addInfo();
        console.log(this.listOfData3);
    }
  }
  selectList($event) {
    console.log($event.key);
  }
  // 当前时间获取
  getDate() {
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1)
      : nowDate.getMonth() + 1;
    const day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate
      .getDate();
      const hour = nowDate.getHours(); // 获取系统时间
      const minute = nowDate.getMinutes();  // 分
      const second = nowDate.getSeconds(); // 秒
      this.dateStr = year + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;
    console.log(this.dateStr);
  }
  // 新增接口
  addInfo() {
    console.log('调用');
    let serviceRequest: ServiceRequest = {
      funccode: 'insertOrUpdate',
      svccode: 'TX001',
      svctype: '0',
      requestdata: {
       bdy: {
        'tablename': 'btf_worklog_check',
        'data': {
         'id': this.Id,
         'record_time': this.dateStr,
         'record_user': 'admin',
         'check_content': this.listOfData,
         'check_time': this.check_time
        }
       },
       coh: {},
       ctl: {}
      }
     };
    this.bsaApi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        this.message.info('提交成功');
      }
    });
  }

}
