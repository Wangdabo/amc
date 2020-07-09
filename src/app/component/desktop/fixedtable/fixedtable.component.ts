import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-fixedtable',
  templateUrl: './fixedtable.component.html',
  styleUrls: ['./fixedtable.component.css']
})
export class FixedtableComponent implements OnInit {

  constructor() { }

  @Input() // 输入属性,表格内容数据
  dataSet: any[];
  @Input() // 输入属性,每页个数
  pageSize: number;
  @Input() // 输入属性,当前页数
  pageIndex: number;
  @Input() // 输入属性,表格头部内容
  listHeader: any[];
  @Input() // 输入属性,表格内容总数
  totalCount: number;
  @Output()
  rowActiveHandler: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去
  @Output()
  pageChangeHandler: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，当点击翻页的时候 发射出去
  ngOnInit(): void {
  }

  clickType: any;

  changePage(pi: number) {
    this.pageIndex = pi;
    this.pageChangeHandler.emit({ pageIndex: pi }); // 发射出去，传递对象出去
  }

  event(item) {
    this.clickType = item.id;
    console.log(this.clickType)
    this.rowActiveHandler.emit(item); // 此时，代表允许有行为，至于是路由跳转还是弹出框 父组件中进行定义和修改
  }
}
