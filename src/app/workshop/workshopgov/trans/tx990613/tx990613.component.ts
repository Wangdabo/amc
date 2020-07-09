import { Component, OnInit } from '@angular/core';
import { BsaApi, ServiceTypeEnum, ServiceRequest } from 'tms-platform';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UtilityService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-tx990613',
  templateUrl: './tx990613.component.html',
  styleUrls: ['./tx990613.component.css']
})
export class Tx990613Component implements OnInit {
  Flag = 'A';
  isVisible = false;
  radioValue = 'A';
  listId = [];
  Id = '';
  dateStr = ''; // 当前时间
  listHeader = [
    {key: 'article_name', label: '物品名称'},
    {key: 'pickup_time', label: '拾遗时间'},
    {key: 'location_pickup', label: '拾遗位置'},
    {key: 'pickup_people', label: '拾遗人'},
    {key: 'watchman', label: '值班人'}
  ];
  rowActions = [
    {key: 'edit', label: '修改'},
    {key: 'delete', label: '删除'},
    {key: 'destory', label: '销毁'}
  ];
  article_name = ''; // 物品名称
  location_pickup = ''; // 拾遗位置
  watchman = ''; // 值班人、
  pickup_time = ''; // 拾遗日期
  pickup_people = ''; // 拾遗人
  article_characteristics = ''; // 物品特征
  listData = [];
  constructor(private bsaApi: BsaApi, private message: NzMessageService ,private utils: UtilityService) { }

  ngOnInit() {
    console.log(JSON.parse(sessionStorage.getItem('user')).user_name);
  }
  select($event) {
    this.Flag = $event;
    if ($event === 'B') {
      this.getData();
    } else if ($event === 'A') {
      this.result();
    }
  }
  // 提交新增
  commit() {
    if (this.article_name === '' || this.location_pickup === '' || this.watchman === '' || this.pickup_time === '' || this.pickup_people === '' || this.article_characteristics === '') {
      this.message.info('请填写完整');
    } else {
      let serviceRequest: ServiceRequest = {
        funccode: 'insertOrUpdate',
        svccode: 'TX001',
        svctype: '0',
        requestdata: {
          bdy: {
            'tablename': 'btf_lost_found',
            'data': {
              'article_name': this.article_name,
              'location_pickup': this.location_pickup,
              'watchman': this.watchman,
              'pickup_time': this.pickup_time,
              'pickup_people': this.pickup_people,
              'article_characteristics': this.article_characteristics
            }
          },
          coh: {},
          ctl: {
            'pageinfo': {
              'pagesize': '10',
              'page': '1'
            }
          }
          }
        };
      this.bsaApi.asynCall(serviceRequest).subscribe(items => {
        if (items.returncode === '000000') {
          console.log('添加数据成功');
          this.message.info('提交成功');
          this.result();
        }
      });
    }
  }

  // 重置
  result() {
    this.article_name = '';
    this.location_pickup = '';
    this.watchman = '';
    this.pickup_time = '';
    this.pickup_people = '';
    this.article_characteristics = '';
  }
  // 数据查询
  getData() {
    let serviceRequest: ServiceRequest = {
      funccode: 'conditionQuery',
      svccode: 'TX001',
      svctype: '0',
      requestdata: {
        bdy: {
          'tablename': 'btf_lost_found',
          'page': '1',
          'pagesize': '10'
        },
        coh: {},
        ctl: {}
        }
      };
    this.bsaApi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        this.listData = items.resultdata.bdy.data;
        console.log('数据查询成功');
        this.result();
      }
    });
  }
  // 行内按钮
  selectList($event) {
    console.log('触发事件');
    console.log($event.item.id);
    console.log($event.key);
    this.listId = [];
    if ($event.key === 'delete') {
      this.listId.push($event.item.id);
      console.log('删除登记');
      this.delete();
    } else if ($event.key === 'edit') {
      this.Id = $event.item.id;
      this.isVisible = true;
      this.article_characteristics = $event.item.article_characteristics;
      this.article_name = $event.item.article_name;
      this.location_pickup = $event.item.location_pickup;
      this.pickup_people = $event.item.pickup_people;
      this.pickup_time = $event.item.pickup_time;
      this.watchman = $event.item.watchman;
    } else if ($event.key === 'destory') {
      console.log('触发销毁');
      this.getDate();
      this.Id = $event.item.id;
      this.article_characteristics = $event.item.article_characteristics;
      this.article_name = $event.item.article_name;
      this.location_pickup = $event.item.location_pickup;
      this.pickup_people = $event.item.pickup_people;
      this.pickup_time = $event.item.pickup_time;
      this.watchman = $event.item.watchman;
      this.setInfo();
      console.log('销毁成功');
    }
   }

  //  销毁
  setInfo() {
    console.log('触发了销毁');
    console.log(this.Id);
    console.log(typeof(this.Id));
    console.log(this.dateStr);
    let serviceRequest: ServiceRequest = {
      funccode: 'insertOrUpdate',
      svccode: 'TX001',
      svctype: '0',
      requestdata: {
        bdy: {
          'tablename': 'btf_lost_found',
          'data': {
            'id': this.Id,
            'article_name': this.article_name,
            'location_pickup': this.location_pickup,
            'watchman': this.watchman,
            'pickup_time': this.pickup_time,
            'pickup_people': this.pickup_people,
            'article_characteristics': this.article_characteristics,
            'collect_time': this.dateStr,
            'collect_handle_people': JSON.parse(sessionStorage.getItem('user')).user_name
          }
        },
        coh: {},
        ctl: {}
        }
      };
    this.bsaApi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        console.log(this.listId);
        this.message.info('销毁成功');
        this.getData();
      }
    });
  }
  // 删除
  delete() {
    let serviceRequest: ServiceRequest = {
      funccode: 'delete',
      svccode: 'TX001',
      svctype: '0',
      requestdata: {
        bdy: {
          'tablename': 'btf_lost_found',
          'id': this.listId
        },
        coh: {},
        ctl: {}
        }
      };
    this.bsaApi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        this.message.info('删除成功');
        this.getData();
      }
    });
  }
  // 修改提交
  ok() {
    this.isVisible = false;
    let serviceRequest: ServiceRequest = {
      funccode: 'insertOrUpdate',
      svccode: 'TX001',
      svctype: '0',
      requestdata: {
        bdy: {
          'tablename': 'btf_lost_found',
          'data': {
            'id': this.Id,
            'article_name': this.article_name,
            'location_pickup': this.location_pickup,
            'watchman': this.watchman,
            'pickup_time': this.pickup_time,
            'pickup_people': this.pickup_people,
            'article_characteristics': this.article_characteristics
          }
        },
        coh: {},
        ctl: {}
        }
      };
    this.bsaApi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        console.log(this.listId);
        this.message.info('修改成功');
        this.getData();
      }
    });
  }

  // 时间获取
  getDate() {
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1)
      : nowDate.getMonth() + 1;
    const day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate
      .getDate();
    this.dateStr = year + '/' + month + '/' + day;
    console.log(this.dateStr);
  }
}
