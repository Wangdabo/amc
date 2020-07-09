import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-titleback',
  templateUrl: './titleback.component.html',
  styleUrls: ['./titleback.component.css']
})
export class TitlebackComponent implements OnInit {
  @Input()
  titleName: string;
  @Input()
  oldTransDef = false;
  constructor() { }

  ngOnInit() {
  }


  sonRouteBack() {
    window.history.go(-1);  // 返回上一页
  }
}
