import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { BsaApi, DcsApi, ServiceRequest, ServiceTypeEnum } from 'tms-platform';
import { NzNotificationService } from 'ng-zorro-antd';
import { Buffer } from "buffer";
import {ContextService} from "../../../workshop/context/context.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit {
  form: FormGroup;
  error = '';
  loading = false;
  loadingdesc = '登录';
  submitTime = new Date();

  // redirectUrl = '/';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private plat: Platform,
    private bsaApi: BsaApi,
    private dcsApi: DcsApi,
    private notification: NzNotificationService,
    private workShopContextService: ContextService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  login(res) {
      console.log(res)
  }
  submitForm(): void {
    if (this.form.valid) {
      this.loading = true;
      this.loadingdesc = '登录中...';
      let passBase = 'Basic ' + new Buffer('APP01:123456').toString('base64');
      let serviceRequest = {
        httpHeader: { Authorization: passBase, 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        httpBody: {
          grant_type: 'password',
          username: this.form.value.userName,
          password: this.form.value.password
        }
      };
      try {
        this.bsaApi.parameterPost('/uaa/oauth/token', serviceRequest)
          .subscribe(data => {
            if (data.access_token) {
              this.bsaApi.addToken('Authorization', 'Bearer ' + data.access_token);
              let serviceRequest: ServiceRequest = {
                funccode: '',
                svccode: 'TP100001',
                svctype: ServiceTypeEnum.USER_CENTER,
                requestdata: { bdy: { username: this.form.value.userName }, coh: {} }
              };
              this.bsaApi.asynCall(serviceRequest).subscribe(items => {
                if (items.returncode === '000000') {
                  this.workShopContextService.setUserInfo(items.resultdata.bdy.userInfo);
                  sessionStorage.setItem('user', JSON.stringify(items.resultdata.bdy.userInfo));
                  // this.router.navigateByUrl('gov/dashbord/transaction/tx990518');
                  // 修改成默认登陆到工作空间
                  this.router.navigateByUrl('toggleWorkshop');
                }
                this.loading = false;
              });
            }
          })
      } finally {
        setTimeout(() => {
          this.loading = false;
          this.loadingdesc = '登录';
        }, 1000)
      } // 用本身的post请求来请求


    }
  }
  get userName() { return this.form.controls.userName; }
  get password() { return this.form.controls.password; }
}
