import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, fromEvent } from 'rxjs';
import { GlobalService} from '../../../service/global.service';
import { Platform } from '@angular/cdk/platform';
import { Location } from '@angular/common';
import { BsaApi, DcsApi, ServiceRequest, ServiceTypeEnum } from 'tms-platform';
import {ContextService} from "../../../workshop/context/context.service";
import {NzI18nService} from "ng-zorro-antd";
import {UtilityService} from "../../../service/utils.service";
@Component({
  selector: 'btf-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  /**屏幕尺寸 */
  resize = document.body.clientWidth;
  isCollapsed: boolean;
  @Output() nzCollapsed = new EventEmitter<void>();
  @Output()
  toggleWorkshop: EventEmitter<any> = new EventEmitter(); // 输出属性，点击了切换Shop

  // 国际化--初始化内容
  language = this.i18n.getLocaleData('index');
  i8Lang = '中文'; // 默认是中文,如果要保存，那就存到本地缓存中，后期改

  constructor(
    private global: GlobalService,
    private router: Router,
    private bsaApi: BsaApi,
    private workShopContextService: ContextService,
    private i18n: NzI18nService
  ) {
  }

  radioValue = 'aiops';
  userName: string;
  ngOnInit() {
    let userInfo = this.workShopContextService.getUserInfo();
    if( userInfo && this.workShopContextService.getUserInfo() !== 'null') {
      this.userName = userInfo.user_name;
    }
    const identification = location.hash.substring(2, 3);
    if (identification === 'a') {
      this.radioValue = 'aiops';
    } else {
      this.radioValue = 'GOV';
    }
    this.global.sendMessage(false);
    /**监听浏览器的变化, 控制图标是否显示 */
    fromEvent(window, 'resize')
      .subscribe((e) => {
        this.resize = e.currentTarget['innerWidth'];
      });
  }

  changeIcon() {
    this.isCollapsed = !this.isCollapsed;
    this.global.sendMessage(this.isCollapsed);
  }

  logout() {
    this.bsaApi.removeHeader('Authorization');
    this.workShopContextService.removeUserInfo();
    if(this.global.getRemotely()) { // 如果是true， 则代表是用远程登录
      // 未登录，跳转到远程login
      window.location.href = this.global.url;
    } else {
      // 未登录，跳转到本地login, 如果要去掉，那就直接吧上面的远程登录去掉
      this.router.navigateByUrl('/passport/login');
    }
  }


  /*  change(toggle) {
    if (toggle === 'aiops') { // 智能运营
      this.router.navigateByUrl('aiops/dashbord/transaction/tx990239');
    } else if (toggle === 'GOV') {
      this.router.navigateByUrl('gov/dashbord/transaction/tx990518');
    } else if (toggle === 'OPS') {
      this.router.navigateByUrl('ops/dashbord/opsindex');
    }
  }*/

  // 国际化切换
  changeLanguage() {
    this.i8Lang === '中文' ? this.i8Lang = '英文' : this.i8Lang = '中文';
    this.i18n.getLocale().locale === 'zh-cn' ? this.i18n.setLocale(UtilityService.toggleNZi18n('en_US')) : this.i18n.setLocale(UtilityService.toggleNZi18n('zh_CN'))
    this.language = this.i18n.getLocaleData('index');
  }

  // 切换工作空间
  tollgeWork(){
    this.router.navigateByUrl('toggleWorkshop');
  }
}
