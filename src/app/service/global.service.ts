import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private subject = new Subject<any>();
  array = [ ];
  isRemotely = false; // 默认是本地
  // ipserver = 'http://222.73.218.43:28002';
  ipserver = 'https://api.brons.top';
  addport = ':28888';
  apiport = ':28002';
  payStem = window.btoa(this.ipserver + this.addport + '/amc/');
  url = this.ipserver + this.addport + '/api/uaa/login/oauth?urlType=' + this.payStem;
  // url = 'http://localhost:8080/qr/login.html?urlType=' + this.payStem;

  // 设置内容
  sendMessage(type: boolean) {
    this.subject.next({ isCollapsed: type });
  }


  // 取出内容
  getMessage(): Observable<any> {

    return this.subject.asObservable();
  }


  // 设置是否是本地
  sendRemotely(type: boolean) {
    this.isRemotely = type;
  }

  // 取出是否是本地
  getRemotely() {
    return this.isRemotely;
  }

}

