import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-style',
  templateUrl: './theme-style.component.html',
  styleUrls: ['./theme-style.component.less']
})

export class ThemeStyleComponent implements OnInit {

  constructor() { }
  color: string;
  colors = [
    {
      key: '红色',
      color: '#F5222D',
    },
    {
      key: '橙色',
      color: '#FA541C',
    },
    {
      key: '黄色',
      color: '#FAAD14',
    },
    {
      key: '天蓝',
      color: '#13C2C2',
    },
    {
      key: '绿色',
      color: '#52C41A',
    },
    {
      key: '浅蓝',
      color: '#1890ff',
    },
    {
      key: '深蓝',
      color: '#2F54EB',
    },
    {
      key: '淡紫',
      color: '#722ED1',
    },
  ];

  ngOnInit() {
  }


  // 颜色切换
  changeColor(color: string) {
    this.color = color;
    console.log(color)
  }


 // 样式确定
  apply() {
      alert('样式修改成功')
  }

  reset() {
    alert('样式重置成功')
  }

}
