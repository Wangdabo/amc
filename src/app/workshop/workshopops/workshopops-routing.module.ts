import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashbordComponent} from './dashbord/dashbord.component';
import { IndexComponent} from './index/index.component';
import {TransactionManageRoutePortalComponent} from "tms-platform";
import {Tx991001Component} from './trans/tx991001/tx991001.component';
import {PublishComponent} from './trans/tx991002/publish/publish.component';
import {Tx991002Component} from './trans/tx991002/tx991002.component';
import {TransactionComponent} from '../../transaction-manage/component/transaction.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashbord', pathMatch: 'full' },
  {
    path: 'dashbord', component: IndexComponent,
    children: [
      // 首页
      {
        path: 'opsindex', component: DashbordComponent
      },
      // 交易页
      {
        path: 'transaction/:transCode', component: TransactionComponent, runGuardsAndResolvers: 'paramsChange'
      },
      {
        path: 'transaction3/:transCode',  // 进入交易管理组件路径。PS：必须指定:transCode参数
        component: TransactionManageRoutePortalComponent, // 交易管理路由入口组件
        runGuardsAndResolvers: 'paramsChange',
        children: [
          { path: 'tx991001Index', component: Tx991001Component }, // 交易管理规定，必须是带上Index，但是访问的时候，只需要访问demo，会自动拼接
          { path: 'tx991002Index', component: Tx991002Component }, // 知识库
          { path: 'tx991002Index/publish', component: PublishComponent }, // 银行卡换卡，因为要走交易管理，所以必须在交易管理中注册
        ]
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopopsRoutingModule {

}
