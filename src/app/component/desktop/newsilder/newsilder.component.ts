import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MenusService } from '../../../service/menus.service';
// tslint:disable-next-line: import-spacing
import  { GlobalService} from '../../../service/global.service';
import { Router } from '@angular/router';
import {NzI18nService} from "ng-zorro-antd";

@Component({
  selector: 'app-newsilder',
  templateUrl: './newsilder.component.html',
  styleUrls: ['./newsilder.component.less']
})
export class NewsilderComponent implements OnInit {

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
  objIndex:any;
  triggerTemplate = null;
  searchName: string;
  isCollapsed = false;
  menus;
  silderToggle = '../../../../assets/newimage/leftbar/leftbar_bg_icon_left.png';

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

  valueChange(search) {
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
    console.log();




    // this.router.navigateByUrl();
  }
  closeTab(index: number): void {
    if(this.tabs.length > 1 ) {
      delete this.objTba[this.tabs[index].transCode];
      console.log(this.objTba);
      this.tabs.splice(index, 1);
      const obj = {
        tabs : this.tabs,
        index: this.tabs.length - 1
      }
      this.clickActiveHandler.emit(obj);
    }
  }


  // 切换侧边栏
  toggleSilder() {
      this.isCollapsed = !this.isCollapsed;
    this.global.sendMessage(this.isCollapsed);
      if(this.isCollapsed) {
            this.silderToggle = './assets/newimage/leftbar/leftbar_bg_icon_right.png';
      } else {
        this.silderToggle = './assets/newimage/leftbar/leftbar_bg_icon_left.png';
      }
  }
}
