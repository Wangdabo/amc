import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashbordComponent} from './dashbord/dashbord.component';
import { IndexComponent} from './index/index.component';
import {TransactionComponent} from '../../transaction-manage/component/transaction.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashbord', pathMatch: 'full' },
  {
    path: 'dashbord', component: IndexComponent,
    children: [
      // 首页
      {
        path: 'aiopsindex', component: DashbordComponent
      },
      // 交易页
      {
        path: 'transaction/:transCode', component: TransactionComponent, runGuardsAndResolvers: 'paramsChange'
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopaiopsRoutingModule {

}
