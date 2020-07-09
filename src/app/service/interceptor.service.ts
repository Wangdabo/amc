import {Injectable, Injector} from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {of} from "rxjs/index";
import {catchError, mergeMap} from "rxjs/internal/operators";
import {Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd";
/** Pass untouched request through to the next request handler. */
@Injectable()
export class InterceptorService implements HttpInterceptor {
  constructor(private injector: Injector,  private notification: NzNotificationService) {}

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {

    // 业务处理：一些通用操作
    switch (event.status) {
      case 200:
        break;
      case 400:
       if(event['error'].error === 'invalid_grant') {
         this.notification.create('error', '登录失败', '用户名/密码错误');
       }
        break;
      case 401:
        this.goTo('/401');
        break;
      case 403:
        break;
      case 404:
        this.goTo('/404');
      case 500:
        this.goTo('/500');
        break;
    }
    return of(event);
  }


  intercept(req: HttpRequest<any>, next: HttpHandler):
  Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理，这是因为一个请求若是业务上错误的情况下其HTTP请求的状态是200的情况下需要
        if (event instanceof HttpResponse && event.status === 200)
          return this.handleData(event);
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err))
    );
  }


}
