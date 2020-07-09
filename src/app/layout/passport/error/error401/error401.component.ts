import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsaApi } from 'tms-platform';
import { IfearmService } from '../../../../service/ifearm.service';
import { ContextService } from '../../../../workshop/context/context.service';
import {GlobalService} from "../../../../service/global.service";
@Component({
  selector: 'app-error401',
  templateUrl: './error401.component.html',
  styleUrls: ['./error401.component.less']
})
export class Error401Component implements OnInit {
  img = this.ifearm.imgSrc;
  constructor(private router: Router, private bsaApi: BsaApi,
    private ifearm: IfearmService, private workShopContextService: ContextService, private global: GlobalService) { }


  ngOnInit() {
  }


  gorouter() {
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
}
