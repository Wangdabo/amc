import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashbordComponent} from './dashbord/dashbord.component';
import { IndexComponent} from './index/index.component';
import {TransactionComponent} from '../../transaction-manage/component/transaction.component';
import {TransactionManageRoutePortalComponent} from 'tms-platform';
import {Tx990300Component} from './trans/tx990300/tx990300.component';
import {Tx990601Component} from './trans/tx990601/tx990601.component';
import {Tx990606Component} from './trans/tx990606/tx990606.component';
import {Tx990608Component} from './trans/tx990608/tx990608.component';
import { Tx990609Component } from './trans/tx990609/tx990609.component';
import { Tx990610Component } from './trans/tx990610/tx990610.component';
import { Tx990611Component } from './trans/tx990611/tx990611.component';
import { Tx990612Component } from './trans/tx990612/tx990612.component';
import { Tx990613Component } from './trans/tx990613/tx990613.component';
import { Tx990614Component } from './trans/tx990614/tx990614.component';
import { Tx990615Component } from './trans/tx990615/tx990615.component';
import { Tx990616Component } from './trans/tx990616/tx990616.component';
import { Tx900617Component } from './trans/tx900617/tx900617.component';
import { Tx990617Component } from './trans/tx990617/tx990617.component';
import { Tx990618Component } from './trans/tx990618/tx990618.component';
import { Tx990619Component } from './trans/tx990619/tx990619.component';
import { Tx339599Component } from './trans/tx339599/tx339599.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashbord', pathMatch: 'full' },
  {
    path: 'dashbord', component: IndexComponent,
    children: [
      // 首页
      // {
      //   path: 'govindex', component: DashbordComponent, data: {useCache: true}
      // },
      // // 交易页
      {
        path: '',
        redirectTo: 'transaction/tx990518',
        component: Tx900617Component
      },
      // 900 排队详情
      {
        path: 'tx900617', component: Tx900617Component
      },
      // 990 营销管理
      {
        path: 'tx990617', component: Tx990617Component
      },
      {
        path: 'transaction/:transCode', component: TransactionComponent, runGuardsAndResolvers: 'paramsChange',
        data: {useCache: true}
      },
      {
        path: 'transaction3/tx990608',
        component: Tx990608Component,
      },
      {
        path: 'transaction3/tx990610',
        component: Tx990610Component,
      },
      {
        path: 'transaction3/tx990609',
        component: Tx990609Component,
      },
      {
        // 客户投诉
        path: 'transaction3/tx990611',
        component: Tx990611Component,
      },
      {
        // 设施检查
        path: 'transaction3/tx990612',
        component: Tx990612Component,
      },
      {
        // 设施检查
        path: 'transaction3/tx990618',
        component: Tx990618Component,
      },
      {
        // 失物招领
        path: 'transaction3/tx990613',
        component: Tx990613Component,
      },
      {
        // 工作日志查询
        path: 'transaction3/tx990614',
        component: Tx990614Component,
      },
      {
        // 客户需求建议
        path: 'transaction3/tx990615',
        component: Tx990615Component,
      },
      {
        // 客户需求建议
        path: 'transaction3/tx990619',
        component: Tx990619Component,
      },
      {
        // 客户需求建议
        path: 'transaction3/tx339599',
        component: Tx339599Component,
      },
      {
        path: 'transaction3/:transCode',  // 进入交易管理组件路径。PS：必须指定:transCode参数
        component: TransactionManageRoutePortalComponent, // 交易管理路由入口组件
        runGuardsAndResolvers: 'paramsChange',
        children: [
          { path: 'tx990300Index', component: Tx990300Component }, // 交易管理规定，必须是带上Index，但是访问的时候，只需要访问demo，会自动拼接
          { path: 'tx990601Index', component: Tx990601Component }, // 知识库
          { path: 'tx990606Index', component: Tx990606Component }, // 消息通知
          { path: 'tx990616Index', component: Tx990616Component }, // 排队管理
          // { path: 'tx990615Index', component: Tx990615Component }, // 客户需求建议
          // { path: 'tx990611Index', component: Tx990611Component }, // 客户投诉
          // { path: 'tx990612Index', component: Tx990612Component }, // 设施检查
          // { path: 'tx990613Index', component: Tx990613Component }, // 失物招领
          // { path: 'tx990614Index', component: Tx990614Component }, // 工作日志查询
          // { path: 'tx990608Index', component: Tx990608Component }, // 重空阀值设置
          // { path: 'tx990609Index', component: Tx990609Component }, // 排队预警设置
          // { path: 'tx990610Index', component: Tx990610Component }, // 吞卡预警
        ]
      },
    ], data: {useCache: true}
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopgovRoutingModule {

}
