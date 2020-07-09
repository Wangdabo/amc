import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class IfearmService {
  // public logCenter = 'https://222.73.218.43:15601/app/kibana';
  public logCenter = 'http://222.73.218.43:25601/app/kibana';
  public registryCenter = 'https://www.brons.top/nacos/';
  public monitoringCenter = 'https://www.brons.top/grafana/';
  public microserviceMonitoring = 'https://www.brons.top/#/wallboard';
  public links = 'https://www.brons.top/zipkin/';
  public imgSrc = './';
  constructor(private global: GlobalService) { }
  // 换算时间
  timeForMat(count) {
    // 拼接时间
    const time1 = new Date();
    const time2 = new Date();
    if (count === 1) {
      time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
    } else {
      if (count >= 0) {
        time1.setTime(time1.getTime());
      } else {
        if (count === -2) {
          time1.setTime(time1.getTime() + (24 * 60 * 60 * 1000) * 2);
        } else {
          time1.setTime(time1.getTime() + (24 * 60 * 60 * 1000));
        }
      }
    }

    const Y1 = time1.getFullYear()
    const M1 = ((time1.getMonth() + 1) > 9 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
    const D1 = (time1.getDate() > 9 ? time1.getDate() : '0' + time1.getDate())
    const timer1 = Y1 + '-' + M1 + '-' + D1 + ' ' + '23:59:59'; // 当前时间

    time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count));
    const Y2 = time2.getFullYear();
    const M2 = ((time2.getMonth() + 1) > 9 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
    const D2 = (time2.getDate() > 9 ? time2.getDate() : '0' + time2.getDate())
    const timer2 = Y2 + '-' + M2 + '-' + D2 + ' ' + '00:00:00'; // 之前的7天或者30天
    return [timer2, timer1];
  }
}

