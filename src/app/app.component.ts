import {Component, OnInit} from '@angular/core';
import {BsaApi, DcsApi, NativeApi, ServiceRequest, ServiceTypeEnum} from 'tms-platform';
import {BootstrapService} from "./bootstrap.service";
import { GlobaltmsService } from "tms-platform-component";
import {Router} from "@angular/router";
import {GlobalService} from "./service/global.service";
import {ContextService} from "./workshop/context/context.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'ng-web';
  constructor(private dcsApi: DcsApi,
              private bootstarp: BootstrapService,
              private golbalTms: GlobaltmsService,
              private global: GlobalService,
              private nativeApi: NativeApi,
              private bsaApi: BsaApi,
              private router: Router,
              private workShopContextService: ContextService) {}

  ngOnInit(): void {
    this.bootstarp.initContext();
    // this.bootstarp.initConfig('222.73.218.43', '28002');
    this.bootstarp.initConfig('api.brons.top','443',  true); // 使用https
    this.golbalTms.sendClient(false); // 设置lib库表单是否是客户端，当前不是
    this.bootstarp.initSessionStorage();
    this.global.sendRemotely(false); // 默认是不是远程启动，如果是远程，则采用远程登录方式，反之采用本地登录方式


    /* 原登录页逻辑 */
    // 根据登录页保存的session值，如果存在，代表是登录页进来的，那就去进行获取getInfo方法
    if(JSON.parse(sessionStorage.getItem('header'))['Authorization'] && this.global.getRemotely()) {
      this.getUserInfo();
    }
  }


  // 获取到token,去获取用户信息
  getUserInfo() {
    let serviceRequest: ServiceRequest = {
      funccode: '',
      svccode: 'TP100001',
      svctype: ServiceTypeEnum.USER_CENTER,
      requestdata: { bdy: {  username: 'admin' }, coh: {} }
    };
    this.bsaApi.asynCall(serviceRequest).subscribe(items => {
      if (items.returncode === '000000') {
        this.workShopContextService.setUserInfo(items.resultdata.bdy.userInfo);
        sessionStorage.setItem('user', JSON.stringify(items.resultdata.bdy.userInfo));
        this.router.navigateByUrl('gov/dashbord/transaction/tx990518');
      }
    });
  }



}
