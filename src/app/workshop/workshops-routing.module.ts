import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from '../layout/shell/default.component';
import { PassportComponent } from '../layout/passport/passport.component';
import { LoginComponent } from '../layout/passport/login/login.component';
import {Error401Component} from '../layout/passport/error/error401/error401.component';
import {Error404Component} from '../layout/passport/error/error404/error404.component';
import {Error500Component} from '../layout/passport/error/error500/error500.component';
import {RouteguardService} from '../service/routeguard.service';
import {WorktoggleComponent} from "../layout/shell/worktoggle/worktoggle.component";

const routes: Routes = [
  /**默认布局 */
  {
    path: '',
    component: DefaultComponent,
    children: [
      // 默认当输入default的时候 去找index路由
      { path: '', redirectTo: 'gov', pathMatch: 'full' },
      // index路由 按需加载 IndexModule中的路由
      {
        path: 'gov', canActivate: [RouteguardService],  loadChildren: './workshopgov/workshopgov.module#WorkshopgovModule',
         data: {useCache: true}
      },
      {
        path: 'aiops', canActivate: [RouteguardService],  loadChildren: './workshopaiops/workshopaiops.module#WorkshopaiopsModule',
        data: {useCache: true}
      },
      {
        path: 'ops', canActivate: [RouteguardService],  loadChildren: './workshopops/workshopops.module#WorkshopopsModule',
        data: {useCache: true}
      },
    ], data: {useCache: true}
  },

  /** 登陆布局 */
  {
    path: 'passport',
    component: PassportComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent }
    ],  data: {useCache: false}

  },

  /* 异常页 */
  {
    path: '401',
    component: Error401Component
  },
  {
    path: '404',
    component: Error404Component
  },
  {
    path: '500',
    component: Error500Component
  },
  {
    path: 'toggleWorkshop',
    component: WorktoggleComponent
  },

  { path: '**', redirectTo: 'passport' } // 默认登陆首页
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [RouteguardService] // 注入路由守卫
})
export class WorkshopRoutingModule { }
