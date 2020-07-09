import { Injectable } from '@angular/core';
import {BsaApi, TransactionContextRegister, ViewType} from "tms-platform";

@Injectable({
  providedIn: 'root'
})
export class BootstrapService { // 引导服务

  constructor(private bsaApi: BsaApi) { }

  initConfig(url, port, https) {
    this.bsaApi.initConfig(url, port, https);
  };

  initContext() {
    // 初始化交易管理上下文
    TransactionContextRegister.getInstance().registe({name: 'Teller', viewType: ViewType.PC});
  }


  // 初始化共享SessionStorage
  initSessionStorage() {
    if (!sessionStorage.length) {
      // 这个调用能触发目标事件，从而达到共享数据的目的
      localStorage.setItem('getSessionStorageamc', JSON.stringify(new Date()));
    };
    // 该事件是核心
    window.addEventListener('storage', function(event) {
      if (event.key == 'getSessionStorageamc') {
        // 已存在的标签页会收到这个事件
        localStorage.setItem('sessionStorageamc', JSON.stringify(sessionStorage));
        localStorage.removeItem('sessionStorageamc');

      } else if (event.key == 'sessionStorageamc' && !sessionStorage.length) {
        // 新开启的标签页会收到这个事件
        var data = JSON.parse(event.newValue),
          value;
        for (let key in data) {
          sessionStorage.setItem(key, data[key]);
        }
      }
    });
  }

}
