import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.less']
})
export class DashbordComponent implements OnInit {

  text: string;
  constructor(
    private router: Router,
  ) {
  }
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
    { text: '客群画像', icon: 'pie-chart', index: 0 },
    { text: '产品管理', icon: 'project', index: 1 },
    { text: '营销活动管理', icon: 'team', index: 2 },
    { text: '定制报告', icon: 'profile', index: 3 },
  ];
  centerData = [
    {
      icon: 'team',
      text: '客户累计量',
      value: '79',
      color: {
        backgroundColor: '#F05050'
      }
    },
    {
      icon: 'notification', text: '累计营销活动', value: '30',
      color: {
        backgroundColor: '#7266ba'
      }
    },
    {
      icon: 'project', text: '累计营销项目', value: '179',
      color: {
        backgroundColor: '#18bc9c'
      }
    },
    {
      icon: 'pic-right', text: '自定义营销策略', value: '29',
      color: {
        backgroundColor: '#61a0a8'
      }
    }
  ];
  gridStyle = {
    width: '25%',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '18px'
  };

  ngOnInit() {
    this.text = '欢迎进入AMC智能运营系统';
    setTimeout(() => {
      this.temp = true;
    });
    this.setItChart();
    this.setLineChart();
  }
  setLineChart() {
    this.optionsLine = {
      title: {
        text: '客户数量变化趋势图',
        subtext: 'Trend Chart of Customer Quantity Change'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        type: 'line'
      }]
    };
  }
  setItChart() {
    this.optionsIT = {
      title: {
        text: '借记卡活跃人数变化图',
        subtext: 'Debit Card Active Number Change Chart'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['活跃', '非活跃']
      },
      toolbox: {
        show: true,
        feature: {

          magicType: { show: true, type: ['line', 'bar'] },

        }
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '活跃',
          type: 'bar',
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
          markPoint: {
            data: [
              { type: 'max', name: '最大值' },
              { type: 'min', name: '最小值' }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        },
        {
          name: '非活跃',
          type: 'bar',
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          markPoint: {
            data: [
              { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
              { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
            ]
          },
          markLine: {
            data: [
              { type: 'average', name: '平均值' }
            ]
          }
        }
      ]
    };
  }
  cardClick(event) {
    console.log(event);
    switch (event.index) {
      case 0:
        this.router.navigate(['aiops/dashbord/transaction/tx990503'], {
          // queryParams: { workGuid: event.guid }
        });
        break;
    }
  }
}
