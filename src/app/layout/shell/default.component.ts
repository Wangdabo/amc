import {Component, OnInit, Input, TemplateRef, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class DefaultComponent implements OnInit {

  isCollapsed = false;
  visible = false;
  // 显示那个header 选项
  constructor() { }

  ngOnInit() {

  }

  // 弹出框方法
  toggle(): void {
    this.visible = !this.visible;
  }



}
