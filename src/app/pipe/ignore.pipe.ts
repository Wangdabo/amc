import { Pipe, PipeTransform } from '@angular/core';

// 文字省略管道, 超过两个字符变成三个点
@Pipe({
  name: 'ignore'
})

export class IgnorePipe implements PipeTransform {

  transform(value: any, args: number): any {
    if (value) {
      const front = value.substr(0, 4);
      const Behind = value.substr(value.length - 4, value.length);
      return  front + '...' + Behind;
    }
  }

}
