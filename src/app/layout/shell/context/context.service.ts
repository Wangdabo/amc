import { Injectable } from '@angular/core';
import {ShellContext, SystemConfig, Theme} from './context';
import {Observable, Observer} from 'rxjs';
import { Platform } from '@angular/cdk/platform';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  constructor(private plat: Platform) { }
  private contextInstance: ShellContext;
  private systemConfigOb: Observable<SystemConfig>;
  private systemConfigObServer: Observer<SystemConfig>;
  private themeOb: Observable<Theme>;
  private themeObserver: Observer<Theme>;

  public initInstance(): void {
    this.contextInstance = new ShellContext();
    // 初始化系统配置
    this.initSystemConfig();
    // 初始化主题
    this.initTheme();
    this.systemConfigOb = Observable.create(observer => {
      observer.next(this.contextInstance.systemConfig);
    });
    this.themeOb = Observable.create(observer => {
      observer.next(this.contextInstance.theme);
    });
  }
  private initSystemConfig(): void {
    const systemConfig = new SystemConfig();
    systemConfig.osType  = this.plat.ANDROID ? 'android' :
                             this.plat.IOS ? 'ios' :
                               this.plat.isBrowser ? 'browser' : '';
   this.contextInstance.systemConfig = systemConfig;
  }
  private initTheme(): void {
    const theme = new Theme();
    this.contextInstance.theme = theme;
  }
  public setSystemConfig(attrName: string, attrValue: any): void {
    this.contextInstance.systemConfig[attrName] = attrValue;
    this.systemConfigObServer.next(this.contextInstance.systemConfig);
  }
  public getSystemConfig(): Observable<SystemConfig> {
    return this.systemConfigOb;
  }
  setTheme(attrName: string, attrValue: any) {
    this.contextInstance.theme[attrName] = attrValue;
    this.themeObserver.next(this.contextInstance.theme);
  }
  getTheme(): Observable<{}> {
    return this.themeOb;
  }
}
