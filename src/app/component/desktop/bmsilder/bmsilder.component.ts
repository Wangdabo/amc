import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { MenusService } from '../../../service/menus.service';
import  { GlobalService} from '../../../service/global.service';
import { Router } from '@angular/router';
import {NzI18nService} from "ng-zorro-antd";
@Component({
  selector: 'app-bmsilder',
  templateUrl: './bmsilder.component.html',
  styleUrls: ['./bmsilder.component.less']
})
export class BmsilderComponent implements OnInit {
  @Input()
  showSearch = false;
  @Input()
  menuTyoe: string; // 菜单名称
  @Input()
  styleSider = true; // 菜单名称
  @Input()
  tabs = [];
  @Output()
  clickActiveHandler: EventEmitter<any> = new EventEmitter(); // 定义一个输出属性，当点击按钮的时候 发射出去

  objTba = {};
  isCollapsed: any;
  menus;

  constructor(
    private menu: MenusService,
    private global: GlobalService,
    private router: Router,
    private i18n: NzI18nService
  ) {

  }

  // 国际化切换初始化内容
  language = this.i18n.getLocaleData('index');

  ngOnInit() {
    // 国际化对应切换
    this.i18n.localeChange.subscribe((item) => {
      this.language = item['index']
    })

    this.menus = this.menu.menus(this.menuTyoe);
    console.log(this.menus, '菜单2');
    this.global.getMessage().subscribe(msg => {
      this.isCollapsed = msg.isCollapsed;
    });
    this.localTab({
      text: '导航页',
      link: 'dashbord/govindex',
      icon: 'anticon anticon-home',
      children: []
    });
  }



  localTab(event){
    if(!this.objTba[event.transCode]) {
      this.objTba[event.transCode] = event;
      this.tabs.push(event);
    }
    let index;
    this.tabs.forEach((i , j) => {
      if (event.transCode === i.transCode) {
        index = j;
      }
    });
    const obj = {
      tabs : this.tabs,
      index: index
    }
    this.clickActiveHandler.emit(obj);

  }


}
