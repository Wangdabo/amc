import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  constructor(
              private router: Router,
              private nznot: NzNotificationService) { }


  requestUrl(urlId, parameter) {
    // 直接调江文奇的方法，传url和参数即可
  }

}

