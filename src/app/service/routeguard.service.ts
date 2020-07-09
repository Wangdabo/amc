import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from "@angular/router";
import {ContextService} from "../workshop/context/context.service";
import {GlobalService} from "./global.service";
  /* 路由守卫 当用户满足一定条件才被允许进入或者离开一个路由。 其提供了一下几种钩子
   canActivate： 控制是否允许进入路由, 处理导航到某路由的情况。 canActivateChild： 等同 canActivate，只不过针对是所有子路由。
   canDeactivate： 控制是否允许离开路由-- 处理从当前路由离开的情况。
   canLoad： 控制是否允许延迟加载整个模块-- 来处理异步导航到某特性模块的情况。
   Resolve:  用在路由激活之前获取路由数据
   配置路由时候用到一些属性，path, component, outlet, children, 路由守卫也是路由属性*/

  /*在分层路由的每个级别上，你都可以设置多个守卫。 路由器会先按照从最深的子路由由下往上检查的顺序来检查 CanDeactivate() 和 CanActivateChild() 守卫。
  然后它会按照从上到下的顺序检查 CanActivate() 守卫。 如果特性模块是异步加载的，在加载它之前还会检查 CanLoad() 守卫。
  如果任何一个守卫返回 false，其它尚未完成的守卫会被取消，这样整个导航就被取消了。*/
@Injectable()
export class RouteguardService implements CanActivate{ // implements 表示接口实现 CanActivate 这个类
  constructor(
    private router: Router,
    private workShopContextService: ContextService,
    private global: GlobalService
  ) { }
  // 进入路由方法, 判断是否登录逻辑
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean { // 返回值 true: 跳转到当前路由 false: 不跳转到当前路由
    let path = next.routeConfig.path; // 当前路由名称
    // nextRoute: 设置需要路由守卫的路由集合
    const nextRoute = ['gov', 'aiops', 'ops'];
    if (nextRoute.indexOf(path) >= 0) {
      if(this.workShopContextService.getUserInfo() && this.workShopContextService.getUserInfo() !== 'null') {
        // 已登录，跳转到当前路由
        return true;
      } else {
        if(this.global.getRemotely()) { // 如果是true， 则代表是用远程登录
          // 未登录，跳转到远程login
          window.location.href = this.global.url;
        } else {
          // 未登录，跳转到本地login, 如果要去掉，那就直接吧上面的远程登录去掉
          this.router.navigateByUrl('/passport/login');
        }
        return false;
      }
    }
  }

}
