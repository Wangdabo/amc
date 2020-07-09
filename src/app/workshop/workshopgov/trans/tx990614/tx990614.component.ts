import { Component, OnInit } from '@angular/core';
import { BsaApi, ServiceTypeEnum, ServiceRequest } from 'tms-platform';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-tx990614',
  templateUrl: './tx990614.component.html',
  styleUrls: ['./tx990614.component.css']
})
export class Tx990614Component implements OnInit {
  Flag = 'B';
  radioValue = 'B';
  isVisible = false;
  listTitle = [
    {key: 'checkItem', label: '项目情况'},
    {key: 'checkStatus', label: '是否正常'}
  ]
  infoData = [];
  rowActions = [
    {key: 'edit', label: '详情'}
  ];
  listOfData = [];
  // 详情展示(营业前，营业中,营业后)
  listOfData1 = [];
  listOfData2 = [];
  listOfData3 = [];
  // 数据展示 表头
  listHeader2 = [
    {key: 'article_name', label: '物品名称'},
    {key: 'pickup_time', label: '拾遗时间'},
    {key: 'pickup_people', label: '拾遗人'},
    {key: 'collect_time', label: '领取/销毁日期'},
    {key: 'collect_handle_people', label: '领取/销毁经办人'},
  ];
  listHeader3 = [
    {key: 'customer_name', label: '客户姓名'},
    {key: 'complaint_time', label: '投诉日期'},
    {key: 'complaint_reason', label: '投诉事由'},
    {key: 'complained_employee', label: '被投诉员工'},
    {key: 'processing_state', label: '处理状态'}
  ];
  listHeader4 = [
    {key: 'customer_name', label: '客户姓名'},
    {key: 'contact_number', label: '联系电话'},
    {key: 'create_date', label: '日期'},
    {key: 'summary', label: '摘要'},
    {key: 'processing_status', label: '处理状态'},
    {key: 'registrant', label: '登记人'}
  ];
  listHeader6 = [
    {key: 'check_time', label: '检查时段'},
    {key: 'record_time', label: '记录时间'},
    {key: 'record_user', label: '记录人'},
  ];
  listData = [];
  tableName = ''; // 表名
  constructor(private bsaApi: BsaApi, private message: NzMessageService) { }

  ngOnInit() {
    this.getData();
  }
  select($event) {
    this.Flag = $event;
    this.getData();
  }
  // 数据查询
  getData() {
    if (this.Flag === 'B') {
      this.tableName = 'btf_worklog_check';
    } else if (this.Flag === 'C') {
      this.tableName = 'btf_lost_found';
    } else if (this.Flag === 'D') {
      this.tableName = 'btf_customer_complaints';
    } else if (this.Flag === 'E') {
      this.tableName = 'btf_demand_suggestion';
    } else if (this.Flag === 'G') {
      this.tableName = 'btf_service_efficiency';
    }
    let serviceRequest: ServiceRequest = {
      funccode: 'conditionQuery',
      svccode: 'TX001',
      svctype: '0',
      requestdata: {
        bdy: {
          'tablename': this.tableName,
          'page': '1',
          'pagesize': '10'
        },
        coh: {},
        ctl: {}
      }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        if (this.Flag === 'B') {
          this.listOfData = items.resultdata.bdy['data'];
          this.listOfData1 = items.resultdata.bdy['data'][0].check_content;
          this.listOfData2 = items.resultdata.bdy['data'][1].check_content;
          this.listOfData3 = items.resultdata.bdy['data'][2].check_content;
        } else {
          this.listData = items.resultdata.bdy.data;
          console.log(items);
          console.log('查询数据成功');
        }
      }
    });
  }
  // 行内 状态转换
  rowActionsHandler($event) {
    console.log($event);
    this.isVisible = true;
    this.infoData = [];
    switch ($event.item.id) {
      case '1':
        this.listOfData1.forEach( e => {
          console.log(e.checkStatus);
          if (e.checkStatus === '0') {
            e.checkStatus = '是';
          } else if (e.checkStatus === '1') {
            e.checkStatus = '否';
          }
        });
        this.infoData = this.listOfData1;
        console.log('营业前', this.listOfData1);
        break;
      case '2':
          this.listOfData2.forEach( e => {
            if (e.checkStatus === '0') {
              e.checkStatus = '是';
            } else if (e.checkStatus === '1') {
              e.checkStatus = '否';
            }
          });
          this.infoData = this.listOfData2;
        console.log('营业中', this.listOfData2);
        break;
      case '3':
          this.listOfData3.forEach( e => {
            if (e.checkStatus === '0') {
              e.checkStatus = '是';
            } else if (e.checkStatus === '1') {
              e.checkStatus = '否';
            }
          });
          this.infoData = this.listOfData3;
        console.log('营业后', this.listOfData3);
        break;
    }
  }
}
