import { Injectable } from '@angular/core';
import {Context} from './context';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  constructor() {
    this.initInstance();
  }

  private contextInstance: Context;
  private userInfoOb: Observable<any>;
  private userInfoSub: Subject<any>;

  private extOb: Observable<any>;
  private extSub: Subject<any>;

  public initInstance(): void {
    this.contextInstance = new Context();
    // 初始化系统配置
    this.userInfoSub = new Subject<any>();
    this.userInfoOb = this.userInfoSub.asObservable();
    this.userInfoSub.next(this.contextInstance.userInfo);
    this.extSub = new Subject<any>();
    this.extOb = this.extSub.asObservable();
  }
  public setUserInfoAttr(attrName: string, attrValue: any): void {
    this.contextInstance.userInfo[attrName] = attrValue;
    this.userInfoSub.next(this.contextInstance.userInfo);
  }
  public setUserInfo(userInfo: any): void {
    this.contextInstance.userInfo = userInfo;
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    this.userInfoSub.next(this.contextInstance.userInfo);
  }
  public removeUserInfo(): void {
    this.contextInstance.userInfo = null;
    sessionStorage.removeItem('userInfo');

  }
  public getUserInfoOb(): Observable<any> {
    return this.userInfoOb;
  }
  public getUserInfo(): any {
    if(this.contextInstance.userInfo) {
      return this.contextInstance.userInfo;
    } else {
      return JSON.parse(sessionStorage.getItem('userInfo'));
    }

  }
  public setExt(attrName: string, attrValue: any): void {
    this.contextInstance.ext[attrName] = attrValue;
    this.extSub.next(this.contextInstance.ext);
  }
  public getExt(): Observable<any> {
    return this.extOb;
  }
}
