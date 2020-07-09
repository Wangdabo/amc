import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UtilityService} from "../../../service/utils.service";
import {NzI18nService} from "ng-zorro-antd";
import {ContextService} from "../../../workshop/context/context.service";
import {BsaApi} from "tms-platform";
import {GlobalService} from "../../../service/global.service";

@Component({
  selector: 'app-new-header',
  templateUrl: './new-header.component.html',
  styleUrls: ['./new-header.component.less']
})
export class NewHeaderComponent implements OnInit {

  constructor(
               private global: GlobalService,
               private router: Router,
               private i18n: NzI18nService,
               private bsaApi: BsaApi,
               private workShopContextService: ContextService) { }


  ngOnInit() {
  }
  // 国际化--初始化内容
  language = this.i18n.getLocaleData('index');
  lanuI8n =  'zh';
  // 模拟跳转
  active() {
    // this.router.navigateByUrl('gov/dashbord/transaction/tx990518');
    this.router.navigateByUrl('toggleWorkshop');
  }


  changeLanguage(item) {
    this.lanuI8n = item;
    this.i18n.getLocale().locale === 'zh-cn' ? this.i18n.setLocale(UtilityService.toggleNZi18n('en_US')) : this.i18n.setLocale(UtilityService.toggleNZi18n('zh_CN'))
    this.language = this.i18n.getLocaleData('index');
  }

  // 切换workshop空间方法
  togglework() {
    this.router.navigateByUrl('toggleWorkshop');
  }

  // 退出方法
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


  message() {

  }
}
