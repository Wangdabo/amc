import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { WorkshopsModule } from './workshop/workshops.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { TransactionModule } from './transaction-manage/transaction.module';
import { ErrorModule } from './shared/error.module';
import { InterceptorService } from './service/interceptor.service';
import { RouteReuseStrategy } from '@angular/router';
import { SimpleReuseStrategy } from './transaction-manage/command/simpleReuseStrategy';
import { NgxElectronModule} from 'ngx-electron'; // 可以看超柜index中的用法
import {NgxChildProcessModule} from 'ngx-childprocess';

// 国际化配置
import { NZ_I18N } from 'ng-zorro-antd';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
import {UtilityService} from './service/utils.service';
import { TransactionManage3Module } from 'tms-platform';

@NgModule({

  declarations: [
    AppComponent,
  ],

  imports: [
    SharedModule,
    LayoutModule,
    WorkshopsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TransactionModule,
    ErrorModule,
    NgxElectronModule,
    NgxChildProcessModule,
    TransactionManage3Module
  ],
  providers: [
    {provide: NZ_I18N, useValue: UtilityService.toggleNZi18n()},
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
